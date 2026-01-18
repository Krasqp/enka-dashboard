import { NextResponse } from "next/server";

const GAS_URL =
  "https://script.google.com/macros/s/AKfycbwBoJnBBtLuC3kyQkgJBahVJOXoBURtdaPJ8o6rqcaTZHPHrRyEhbHcfUox9WwH2UXS8g/exec?type=sidebar";

export async function GET() {
  try {
    const res = await fetch(GAS_URL, {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "GAS response failed" },
        { status: 500 }
      );
    }

    const text = await res.text();

    // HTML gelirse yakala
    if (text.startsWith("<")) {
      return NextResponse.json(
        { error: "GAS HTML döndürdü" },
        { status: 500 }
      );
    }

    const data = JSON.parse(text);
    return NextResponse.json(data);

  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
