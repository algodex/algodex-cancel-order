import React, { useEffect, useState } from "react";
import { useWallet } from "@txnlab/use-wallet";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import {
  CheckCircle2,
  Copy,
  MinusCircle,
  PlusCircle,
  Wallet,
} from "lucide-react";
import { copyAddress, checkAlgoBalance } from "@/lib/utils";
export default function ConnectMenu() {
  const { providers, activeAccount } = useWallet();
  const [algoBalance, setAlgoBalance] = useState<number[] | false>(false);

  const handleCheckAlgoBalance = async () => {
    const balance = await checkAlgoBalance(activeAccount?.address as string);
    setAlgoBalance(balance);
  };
  useEffect(() => {
    if (activeAccount?.address) {
      handleCheckAlgoBalance();
    }
  }, [activeAccount]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className={`${
              activeAccount ? "w-60" : "w-44"
            } border-2 border-black bg-slate-100 text-black text-lg font-medium hover:bg-slate-200`}
          >
            {activeAccount ? (
              <>
                <Wallet className="" strokeWidth={1.25} />{" "}
                <p className="ml-4">
                  {activeAccount?.address.substring(0, 6)}...
                  {activeAccount?.address.substring(54, 58)}
                </p>
              </>
            ) : (
              "Connect Wallet"
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[590px] px-4">
          {activeAccount ? (
            <>
              <div className="flex flex-row items-center mb-4 mt-4 justify-between">
                <div className="flex flex-row items-center">
                  <div className="w-11 h-11 rounded-full border-2 border-slate-800 flex items-center mr-6 ml-4">
                    <Wallet className="m-auto" strokeWidth={1.25} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">
                      {activeAccount?.name}
                    </h3>
                    <div
                      onClick={() => {
                        copyAddress(activeAccount?.address as string);
                      }}
                      className="flex flex-row items-center cursor-pointer"
                    >
                      <p className="mr-4">
                        {activeAccount?.address.substring(0, 6)}...
                        {activeAccount?.address.substring(54, 58)}
                      </p>
                      <Copy size={20} strokeWidth={1.25} />
                    </div>
                  </div>
                </div>
                <div className="flex flex-row h-20">
                  <div className="border-r-2 border-slate-800 pr-4 flex flex-col items-end justify-around">
                    <p className="">Total</p>
                    <p className="">Available</p>
                  </div>
                  <div className="flex flex-col w-24">
                    <div className="flex flex-row items-center">
                      <Image
                        src="algorand.svg"
                        alt="Algorand logo"
                        width={40}
                        height={40}
                      />
                      <p>
                        {algoBalance
                          ? (algoBalance[0] / Math.pow(10, 6)).toFixed(3)
                          : "0.000"}
                      </p>
                    </div>
                    <div className="flex flex-row items-center">
                      <Image
                        src="algorand.svg"
                        alt="Algorand logo"
                        width={40}
                        height={40}
                      />
                      <p>
                        {algoBalance
                          ? (
                              (algoBalance[0] - algoBalance[1]) /
                              Math.pow(10, 6)
                            ).toFixed(3)
                          : "0.000"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator />
            </>
          ) : null}

          {providers?.map((provider) => (
            <>
              <div
                className="mb-4 mt-4 flex flex-row justify-between"
                key={provider.metadata.id}
              >
                <div className="flex flex-row items-center ml-4">
                  <Image
                    className="rounded-full h-11 w-11"
                    alt={`${provider.metadata.name} icon`}
                    src={provider.metadata.icon}
                    width={44}
                    height={44}
                  />
                  <div className="pl-4">
                    <h4 className="flex flex-row ">
                      {provider.metadata.name} {provider.isActive && "[active]"}
                    </h4>

                    {provider.isActive && provider.accounts.length && (
                      <Select
                        onValueChange={(value: string) =>
                          provider.setActiveAccount(value)
                        }
                      >
                        <SelectTrigger className="w-[300px] mt-2 truncate">
                          <SelectValue placeholder={activeAccount?.address} />
                        </SelectTrigger>
                        <SelectContent>
                          {provider.accounts.map((account) => (
                            <SelectItem
                              key={account.address}
                              value={account.address}
                            >
                              {account.address}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
                <div className="space-x-2 flex flex-row items-center">
                  {provider.isConnected && provider.isActive ? (
                    <Button
                      className="w-40 mt-8 flex flex-row"
                      variant="secondary"
                      type="button"
                      onClick={provider.disconnect}
                      disabled={!provider.isConnected}
                    >
                      <MinusCircle
                        className="mr-4"
                        size={20}
                        strokeWidth={1.25}
                      />
                      Disconnect
                    </Button>
                  ) : !provider.isConnected ? (
                    <Button
                      className="w-40 flex flex-row pr-6"
                      variant="secondary"
                      type="button"
                      onClick={provider.connect}
                      disabled={provider.isConnected}
                    >
                      <PlusCircle
                        className="mr-6"
                        size={20}
                        strokeWidth={1.25}
                      />
                      Connect
                    </Button>
                  ) : (
                    <Button
                      className="w-40 flex flex-row"
                      variant="secondary"
                      type="button"
                      onClick={provider.setActiveProvider}
                      disabled={!provider.isConnected || provider.isActive}
                    >
                      <CheckCircle2
                        className="mr-6"
                        size={20}
                        strokeWidth={1.25}
                      />
                      Set Active
                    </Button>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator />
            </>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
