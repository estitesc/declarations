import React from "react";
import type { NextPage } from "next";
import styles from "../styles/Declaration.module.css";
import { useRouter } from "next/router";
import Declaration from "../c/Declaration";
import { ethers } from "ethers";
import Sonnet from "../abis/Sonnet.json";
import useNetworkDetails from "../h/useNetworkDetails";
import useMint from "../h/useMint";

declare global {
  interface Window {
    ethereum: any;
  }
}

const Blockchain: NextPage = () => {
  // const [account, setAccount] = React.useState("");
  // const [network, setNetwork] = React.useState(1);
  // const [provider, setProvider] = React.useState(undefined as any);

  const { query } = useRouter();
  const { text, size = "75vh" } = query;

  // useNetworkDetails(setProvider, setNetwork, setAccount);
  const { mint } = useMint();

  // const useContract = React.useCallback(() => {
  //   console.log("network is", network);
  //   const networkData = Sonnet.networks[network];
  //   console.log("network data is", networkData);
  //   if (networkData) {
  //     const contract = new ethers.Contract(
  //       networkData.address,
  //       Sonnet.abi,
  //       provider
  //     );
  //     (async () => {
  //       const name = await contract.name();
  //       console.log("contract name", name);
  //     })();
  //   } else {
  //     console.log("Sonnet not deployed to the network in question");
  //   }
  // }, [network, provider]);

  return (
    <div className={styles.page}>
      {/* <span>{account}</span> */}
      <button
        onClick={() =>
          mint("https://sonn3t.com/disclaimed_witch.png", [
            [10, 15],
            [20, 25],
            [30, 34],
          ])
        }
      >
        hello do it
      </button>
      <Declaration size={size.toString()}>{text?.toString()}</Declaration>
    </div>
  );
};

export default Blockchain;
