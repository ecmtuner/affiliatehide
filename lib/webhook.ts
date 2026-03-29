// Webhook delivery for Pro plan companies

export async function deliverWebhook(
  webhookUrl: string,
  programId: string,
  linkCode: string,
  amount: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "conversion",
        programId,
        linkCode,
        amount,
        timestamp: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(10000), // 10s timeout
    })
    return { success: res.ok }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
