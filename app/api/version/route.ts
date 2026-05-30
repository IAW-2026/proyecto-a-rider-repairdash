export const dynamic = "force-dynamic";

export async function GET() {
  const buildId = process.env.VERCEL_GIT_COMMIT_SHA ?? "dev";
  return new Response(JSON.stringify({ buildId }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
