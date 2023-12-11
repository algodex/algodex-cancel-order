import { useWallet } from "@txnlab/use-wallet";
import {
  algodClient,
  algodIndexer,
  notifier,
  isValidAddress,
} from "@/lib/utils";
import { PeraWalletConnect } from "@perawallet/connect";
import { DeflyWalletConnect } from "@blockshake/defly-connect";
import toast from "react-hot-toast";
import signer from "../lib/peraSigner";
import { useEffect, useState } from "react";

function useCancelOrder() {
  const config = require("../config.json");
  const AlgodexAPI = require("@algodex/algodex-sdk");
  const api = new AlgodexAPI({ config });
  const compile = require("@algodex/algodex-sdk/lib/order/compile");
  const { activeAddress, activeAccount } = useWallet();
  const getFirstArg = (appArgs: any) => {
    const appArgsDecoded = appArgs.map((arg: any) =>
      Buffer.from(arg, "base64").toString()
    );
    return appArgsDecoded[0];
  };

  async function getWallet() {
    if (activeAccount?.providerId === "defly") {
      const deflyWalletRehydrate = new DeflyWalletConnect();
      await deflyWalletRehydrate.reconnectSession();
      return deflyWalletRehydrate;
    }
    if (activeAccount?.providerId === "pera") {
      const peraWalletRehydate = new PeraWalletConnect();
      await peraWalletRehydate.reconnectSession();
      return peraWalletRehydate;
    }
  }
  async function cancelOrder(escrowAddress: string) {
    try {
      if (!(await isValidAddress(escrowAddress))) {
        throw new Error("Escrow address is not valid");
      }
      notifier("Canceling, please wait...", "loading");
      const wallet = await getWallet();
      const peraSigner = async (orders: any) => {
        const signedTxn = await signer(orders, wallet);
        return signedTxn;
      };

      const accountTransactions = await algodIndexer
        .lookupAccountTransactions(escrowAddress as string)
        .txType("appl")
        .do();

      let txNum = -1;

      accountTransactions.transactions.forEach(
        (transaction: any, i: number) => {
          if (
            transaction["application-transaction"] &&
            getFirstArg(
              transaction["application-transaction"]["application-args"]
            ) === "open"
          ) {
            txNum = i;
            return;
          }
        }
      );

      if (txNum === -1) {
        throw new Error("Could not find open transaction!");
      }
      const transaction = accountTransactions.transactions[txNum];

      const appArgs =
        transaction["application-transaction"]["application-args"];

      const appArgsDecoded = appArgs.map((arg: any) =>
        Buffer.from(arg, "base64").toString()
      );

      if (getFirstArg(appArgs) !== "open") {
        throw new Error("first argument is not open");
      }

      const orderEntry = appArgsDecoded[1];
      const N = parseInt(orderEntry.split("-")[0]);
      const D = parseInt(orderEntry.split("-")[1]);
      const assetId = parseInt(orderEntry.split("-")[3]);
      const appId = transaction["application-transaction"]["application-id"];
      const version = appArgsDecoded[2].charCodeAt(0);
      const ownerAddress = activeAddress;

      const order = {
        client: algodClient,
        min: 0,
        address: ownerAddress,
        asset: { id: assetId },
        contract: { N: N, D: D },
        type: appId === 354073718 ? "buy" : "sell",
        version,
        appId: appId,
        wallet: {
          connector: {
            sign: peraSigner,
          },
        },
        execution: "close",
      };

      const orderWithLsig = await compile.withLogicSigAccount(order);

      order.contract = {
        ...orderWithLsig.contract,
        creator: activeAddress,
      };

      notifier("Awaiting signature", "loading");
      await api.closeOrder(order);
      toast.dismiss();
    } catch (error: any) {
      console.log(error);
      notifier(error.message, "error");
    }
  }

  return {
    cancelOrder,
  };
}

export default useCancelOrder;
