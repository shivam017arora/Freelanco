import React, { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";

// Top navbar
export default function ConnectWeb3() {
  const {
    enableWeb3,
    isWeb3Enabled,
    isWeb3EnableLoading,
    account,
    Moralis,
    deactivateWeb3,
  } = useMoralis();

  useEffect(() => {
    if (
      !isWeb3Enabled &&
      typeof window !== "undefined" &&
      window.localStorage.getItem("connected")
    ) {
      enableWeb3();
      // enableWeb3({provider: window.localStorage.getItem("connected")}) // add walletconnect
    }
  }, [isWeb3Enabled]);
  // no array, run on every render
  // empty array, run once
  // dependency array, run when the stuff in it changesan

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      console.log(`Account changed to ${account}`);
      if (account == null) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
        console.log("Null Account found");
      }
    });
  }, []);

  return (
    <>
      <button
        onClick={async () => {
          // await walletModal.connect()
          await enableWeb3();
          // depends on what button they picked
          if (typeof window !== "undefined") {
            window.localStorage.setItem("connected", "injected");
            // window.localStorage.setItem("connected", "walletconnect")
          }
        }}
        disabled={isWeb3EnableLoading || isWeb3Enabled}
        className="text-white text-uppercase btn"
      >
        {account == null ? "Connect" : "Connected"}
      </button>
    </>
  );
}
