import { Metadata } from "next"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import ProgramLandingClient from "./ProgramLandingClient"

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const program = await prisma.program.findUnique({
    where: { slug: params.slug },
    include: { company: { select: { name: true } } },
  })

  if (!program) return { title: "Program Not Found" }

  const description =
    program.description ??
    `Join ${program.name} affiliate program by ${program.company.name} and earn ${program.baseRate}${program.rateType === "percent" ? "%" : "$"} commission.`

  return {
    title: `${program.name} Affiliate Program — ${program.company.name}`,
    description,
    alternates: {
      canonical: `/programs/${params.slug}`,
    },
    openGraph: {
      title: `${program.name} Affiliate Program`,
      description,
      images: program.logoUrl ? [program.logoUrl] : [],
    },
  }
}

export default async function ProgramLandingPage({
  params,
}: {
  params: { slug: string }
}) {
  const program = await prisma.program.findUnique({
    where: { slug: params.slug, isActive: true },
    include: { company: { select: { name: true } } },
  })

  if (!program) notFound()

  return <ProgramLandingClient program={program} />
}
