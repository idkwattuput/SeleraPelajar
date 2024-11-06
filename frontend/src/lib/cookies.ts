"use server";
import { cookies } from "next/headers";

export async function getAccessToken() {
  const cookieStore = cookies();
  return cookieStore.get("SPAT")?.value;
}

export async function setAccessToken(accessToken: string) {
  const cookieStore = cookies();
  cookieStore.set("SPAT", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 20,
  });
}

export async function getRefreshToken() {
  const cookieStore = cookies();
  return cookieStore.get("SPRT")?.value;
}
