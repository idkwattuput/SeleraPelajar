"use client"

import { Button } from "@/components/ui/button";
import { CircleUserRound, KeyRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactElement } from "react";

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const items = [
    { label: "Profile", icon: <CircleUserRound />, href: "/profile" },
    { label: "Password", icon: <KeyRound />, href: "/profile/password" },
  ]

  return (
    <div className="p-4 flex flex-col md:flex-row gap-10">
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <SidebarItem key={item.label} label={item.label} icon={item.icon} href={item.href} />
        ))}
      </div>
      {children}
    </div>
  );
}

function SidebarItem({ label, icon, href }: { label: string, icon: ReactElement, href: string }) {
  const currentPath = usePathname();
  const isActive = currentPath === href;

  return (
    <Link href={href}
      className="w-full"
    >
      {isActive ? (
        <Button variant="secondary" className="font-bold w-full">
          {icon}
          {label}
        </Button>
      ) : (
        <Button variant="ghost" className="w-full">
          {icon}
          {label}
        </Button>
      )}
    </Link>
  )
}
