import prisma from "@/lib/prisma"

/**
 * Calculate the effective commission rate for an affiliate on a program.
 * Checks commission tiers if enabled; falls back to customRate or baseRate.
 */
export async function getEffectiveRate(
  membershipId: string,
  programId: string,
  affiliateId: string
): Promise<{ rate: number; type: string }> {
  const program = await prisma.program.findUnique({
    where: { id: programId },
    include: { commissionTiers: { orderBy: { minSales: "asc" } } },
  })

  if (!program) return { rate: 0, type: "percent" }

  const membership = await prisma.affiliateMembership.findUnique({
    where: { id: membershipId },
  })

  const baseRate = membership?.customRate ?? program.baseRate
  const rateType = program.rateType

  if (!program.tiersEnabled || program.commissionTiers.length === 0) {
    return { rate: baseRate, type: rateType }
  }

  // Calculate affiliate's total confirmed sales amount
  const conversionsAgg = await prisma.conversion.aggregate({
    where: {
      link: { membershipId },
      status: "confirmed",
    },
    _sum: { amount: true },
  })

  const totalSales = conversionsAgg._sum.amount ?? 0

  // Find highest applicable tier
  let applicableRate = baseRate
  for (const tier of program.commissionTiers) {
    if (totalSales >= tier.minSales) {
      applicableRate = tier.rate
    }
  }

  return { rate: applicableRate, type: rateType }
}
