"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "@/components/navigation";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <>
      {!isLoginPage && <Navigation />}
      <div className={!isLoginPage ? "pt-16" : ""}>{children}</div>
    </>
  );
}
