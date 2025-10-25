import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getSession();
    return NextResponse.json({ user });
  } catch (error) {
    console.error(" Session error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
