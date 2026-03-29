// Email notification helper using Resend API
// If RESEND_API_KEY is not set, all calls are silent no-ops

const FROM = "notifications@affiliatehide.com"

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return // silently skip if not configured

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    })
  } catch {
    // Never crash on email failures
  }
}

export async function emailNewApplication(companyEmail: string, affiliateName: string): Promise<void> {
  await sendEmail(
    companyEmail,
    `New affiliate application from ${affiliateName}`,
    `<p>You have a new affiliate application from <strong>${affiliateName}</strong>.</p>
     <p>Log in to your dashboard to review and approve or reject the application.</p>`
  )
}

export async function emailApplicationApproved(affiliateEmail: string, programName: string): Promise<void> {
  await sendEmail(
    affiliateEmail,
    `You've been approved for ${programName}!`,
    `<p>Great news! You've been approved for <strong>${programName}</strong>.</p>
     <p>Log in to your affiliate dashboard to get your tracking links and start promoting.</p>`
  )
}

export async function emailApplicationRejected(affiliateEmail: string, programName: string): Promise<void> {
  await sendEmail(
    affiliateEmail,
    `Your application to ${programName} was not approved`,
    `<p>Unfortunately, your application to <strong>${programName}</strong> was not approved at this time.</p>
     <p>You can continue browsing other programs in your dashboard.</p>`
  )
}

export async function emailConversionEarned(
  affiliateEmail: string,
  amount: number,
  programName: string
): Promise<void> {
  await sendEmail(
    affiliateEmail,
    `You earned $${amount.toFixed(2)} from ${programName}!`,
    `<p>Congrats! You just earned <strong>$${amount.toFixed(2)}</strong> from <strong>${programName}</strong>.</p>
     <p>Log in to your earnings dashboard to track your balance.</p>`
  )
}
