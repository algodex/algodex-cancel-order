import * as algokit from "@algorandfoundation/algokit-utils";
import toast from "react-hot-toast";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import algosdk from "algosdk";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const getActiveNetwork = () => {
  return process.env.NEXT_PUBLIC_ALGORAND_NETWORK &&
    process.env.NEXT_PUBLIC_ALGORAND_NETWORK.toLowerCase() === "mainnet"
    ? "mainnet"
    : "testnet";
};
export const algodClient = algokit.getAlgoClient({
  server:
    getActiveNetwork() === "testnet"
      ? "https://node.testnet.algoexplorerapi.io"
      : "https://node.algoexplorerapi.io/",
  port: "",
  token: "",
});
export const algodIndexer = algokit.getAlgoIndexerClient({
  server:
    getActiveNetwork() === "testnet"
      ? "https://testnet-idx.algonode.cloud"
      : "https://mainnet-idx.algonode.cloud",
  port: "",
  token: "",
});
export async function checkAlgoBalance(address: string) {
  const accInfo = await algodClient.accountInformation(address).do();
  return [accInfo["amount"], accInfo["min-balance"]];
}
export async function isValidAddress(address: string) {
  return algosdk.isValidAddress(address);
}
export const notifier = (msg: string, type: string) => {
  toast.dismiss();
  let lastToastId: any;
  if (lastToastId) {
    toast.dismiss(lastToastId);
  }
  if (type === "loading") lastToastId = toast.loading(msg);
  if (type === "success") lastToastId = toast.success(msg, { duration: 5000 });
  if (type === "error") lastToastId = toast.error(msg, { duration: 5000 });
};
export const copyAddress = (address: string) => {
  window.navigator.clipboard.writeText(address).then(
    () => {
      notifier("Copied wallet address to clipboard!", "success");
    },
    () => {
      notifier("Failed to copy wallet address to clipboard", "error");
    }
  );
};
