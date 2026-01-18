import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key missing" },
        { status: 500 }
      );
    }

    const city = "Moscow";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || "Weather API error" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      city: data.name,
      temp: Math.round(data.main.temp),
      icon:
        data.weather?.[0]?.main === "Clouds"
          ? "☁️"
          : data.weather?.[0]?.main === "Clear"
          ? "☀️"
          : data.weather?.[0]?.main === "Rain"
          ? "🌧️"
          : "🌡️",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
