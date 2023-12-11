"use client";
import { useWallet } from "@txnlab/use-wallet";
import useCancelOrder from "@/hooks/useCancelOrder";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function CancelOrder() {
  const { activeAddress } = useWallet();
  const { cancelOrder } = useCancelOrder();
  const [escrowAddress, setEscrowAddress] = useState<string>("");

  return (
    <div className="flex flex-col h-72 justify-between">
      <h2 className="text-2xl font-semibold mb-4">Cancel Order</h2>
      <form action="" className="flex flex-col justify-between h-52 ">
        <p className="font-medium">Active Address: </p>
        <p>{!activeAddress ? "Please connect your wallet." : activeAddress}</p>
        <label className="font-medium">Order Escrow Address:</label>
        <Input
          className=" border-slate-800 w-[600px]"
          type="text"
          placeholder="Escrow Address"
          onChange={(e) => {
            setEscrowAddress(e.target.value);
          }}
        />
      </form>
      <p className="italic my-3">
        First connect your wallet. Then enter the escrow address where your
        order is stored. You can find this on{" "}
        <Link
          className="underline font-semibold"
          href="https://algoexplorer.io/"
          target="_blank"
        >
          AlgoExplorer
        </Link>
        .
      </p>
      <Link
        href="/instructions"
        className="italic font-semibold mb-3 underline w-32"
      >
        View instructions
      </Link>
      {activeAddress ? (
        <Button
          className="w-44"
          onClick={() => {
            cancelOrder(escrowAddress);
          }}
        >
          Cancel Order
        </Button>
      ) : (
        <p></p>
      )}
    </div>
  );
}
