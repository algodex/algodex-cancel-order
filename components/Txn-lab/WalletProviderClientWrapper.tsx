"use client";
import React from "react";
import {
  WalletProvider,
  useInitializeProviders,
  PROVIDER_ID,
} from "@txnlab/use-wallet";
import { PeraWalletConnect } from "@perawallet/connect";

export const WalletProviderClientWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const providers = useInitializeProviders({
    providers: [{ id: PROVIDER_ID.PERA, clientStatic: PeraWalletConnect }],
  });
  return <WalletProvider value={providers}>{children}</WalletProvider>;
};
