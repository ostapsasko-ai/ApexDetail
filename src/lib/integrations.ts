type Environment = Record<string, string | undefined>;

export function getIntegrationStates(env: Environment) {
  return {
    stripe: env.STRIPE_SECRET_KEY ? "live" as const : "demo" as const,
    maps: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? "live" as const : "unavailable" as const,
    pickupPoints: env.PICKUP_PROVIDER_API_URL && env.PICKUP_PROVIDER_TOKEN ? "live" as const : "unavailable" as const,
    email: env.EMAIL_API_URL && env.EMAIL_API_TOKEN ? "live" as const : "unavailable" as const
  };
}

export async function sendTransactionalEmail(payload: { to: string; subject: string; text: string }) {
  const states = getIntegrationStates(process.env);
  if (states.email !== "live") return { status: "NOT_CONFIGURED" as const };
  const response = await fetch(process.env.EMAIL_API_URL!, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.EMAIL_API_TOKEN}` }, body: JSON.stringify({ from: process.env.EMAIL_FROM, ...payload }) });
  if (!response.ok) return { status: "FAILED" as const };
  return { status: "SENT" as const };
}

