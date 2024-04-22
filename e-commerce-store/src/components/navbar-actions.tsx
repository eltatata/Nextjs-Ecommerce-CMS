"use client";

import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

import useCart from "@/hooks/use-cart";

import { ShoppingBag } from "lucide-react";

import Button from "@/components/ui/button";

export default function NavbarActions() {
  const router = useRouter();
  const cart = useCart();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null

  return (
    <div className="ml-auto flex items-center gap-x-4">
      <Button onClick={() => router.push("/cart")} className="flex items-center rounded-full bg-black px-4 py-2">
        <ShoppingBag
          size={20}
          color="white"
          className="w-4 h-4"
        />
        <span className="ml-2 text-sm font-medium text-white">
          {cart.items.length}
        </span>
      </Button>
    </div>
  )
}
