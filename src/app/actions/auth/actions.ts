"use server";
import { UserCredentails } from "@/_components/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getSession() {
  const session = (await cookies()).get("auth")?.value;
  if (session) return session;
  if (!session) return null;
}
export async function loginAction(payload: UserCredentails) {
  const email = payload.email;
  const password = payload.password;
  try {
    const cookiesInstance = await cookies();
    if (email === "admin@promise.com" && password === "Promise@123") {
      cookiesInstance.set("auth", JSON.stringify({ email, password }));
      return true;
    }
    return false;
  } catch (e: any) {
    console.log(e);
    return false;
  }
}
export const clearCookies = async () => {
  const cookiesInstance = await cookies();
  cookiesInstance.delete("auth");
  redirect("/login");
};
