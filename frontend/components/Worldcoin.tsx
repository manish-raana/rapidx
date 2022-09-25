import React from "react";
import dynamic from "next/dynamic";
import { utils } from "@worldcoin/id";
import { WidgetProps } from "@worldcoin/id";
import { useEffect } from "react";
import styles from "../styles/Home.module.css";
import axios from 'axios';

const WorldIDWidget = dynamic<WidgetProps>(() => import("@worldcoin/id").then((mod) => mod.WorldIDWidget), { ssr: false });

const Worldcoin = ({ userAddress }: any) => {

  const handleVerification = async (merkle_root:string, nullifier_hash: string, proof: string) => {
    const reqBody = {
      merkle_root: merkle_root,
      nullifier_hash: nullifier_hash,
      action_id: "wid_staging_38881f93596ddd09930a8842c884b910",
      signal: userAddress,
      proof: proof,
    };
    const response = await axios.post("/api/worldcoinVerification");
  };
  const widgetProps: WidgetProps = {
    actionId: "wid_staging_38881f93596ddd09930a8842c884b910",
    signal: userAddress,
    enableTelemetry: true,
    appName: "rapidx",
    signalDescription: "Merchant Verification for fraud prevention",
    theme: "dark",
    debug: true, // Recommended **only** for development
    onSuccess: (result) => handleVerification(result.merkle_root,result.nullifier_hash, result.proof),
    onError: ({ code, detail }) => console.log({ code, detail }),
    onInitSuccess: () => console.log("Init successful"),
    onInitError: (error) => console.log("Error while initialization World ID", error),
  };
  return (
    <div className="h-[50px]">
      <main className={styles.main}>
        <WorldIDWidget {...widgetProps} />
      </main>
    </div>
  );
};

export default Worldcoin;
