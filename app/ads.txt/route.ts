import { NextResponse } from "next/server";
import { buildAdsTxtContent } from "@/lib/integrations/google-services";

export function GET() {
  const { body } = buildAdsTxtContent();
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
