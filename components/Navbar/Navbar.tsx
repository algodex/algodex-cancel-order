"use client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import ConnectMenu from "../Txn-lab/Connect-menu";
import Image from "next/image";
export default function Navbar() {
  return (
    <div className="bg-stone-200 flex flex-row justify-between ">
      <Image
        src="algodex-logo.svg"
        alt="Algodex logo"
        width={200}
        height={0}
        className="ml-8"
      />
      <NavigationMenu className="h-24 pt-0 pr-20 w-full flex flex-row justify-between">
        <NavigationMenuList className="flex flex-row ml-20 justify-between w-[200px]">
          <NavigationMenuItem className="font-medium text-lg">
            <Link href="/">Home</Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="font-medium text-lg">
            <Link href="/instructions">Instructions</Link>
          </NavigationMenuItem>
        </NavigationMenuList>
        <ConnectMenu />
      </NavigationMenu>
    </div>
  );
}
