import { NextResponse } from "next/server";

const GAS_URL =
  "https://script.google.com/macros/s/AKfycbzm3MnoIOFiAhJLXiqm8BqXvKOVU8Azrw9H8_-N5fAlvPeKkTYJMjkQpYkW2l8vYb8l/exec?type=project-ilerleme";

export async function GET() {
  try {
    const res = await fetch(GAS_URL, { cache: "no-store" });
    const text = await res.text();

    if (!res.ok || text.startsWith("<")) {
      return NextResponse.json(
        { error: "GAS ilerleme response invalid" },
        { status: 500 }
      );
    }

    return NextResponse.json(JSON.parse(text));
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Ilerleme fetch error" },
      { status: 500 }
    );
  }
}
