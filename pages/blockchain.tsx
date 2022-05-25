import React from "react";
import type { NextPage } from "next";
import styles from "../styles/Declaration.module.css";
import { useRouter } from "next/router";
import Declaration from "../c/Declaration";
import { ethers } from "ethers";
import Sonnet from "../abis/Sonnet.json";

declare global {
  interface Window {
    ethereum: any;
  }
}

const Blockchain: NextPage = () => {
  const [account, setAccount] = React.useState("");
  const [network, setNetwork] = React.useState(1);
  const [provider, setProvider] = React.useState(undefined as any);

  const { query } = useRouter();
  const { text, size = "75vh" } = query;

  React.useEffect(() => {
    (async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const net = await provider.getNetwork();
      setNetwork(net.chainId);

      let userAddress = await signer.getAddress();
      setAccount(userAddress);
      console.log("got user address", userAddress);
    })();
  }, []);

  const useContract = React.useCallback(() => {
    console.log("network is", network);
    const networkData = Sonnet.networks[network];
    console.log("network data is", networkData);
    if (networkData) {
      const contract = new ethers.Contract(
        networkData.address,
        Sonnet.abi,
        provider
      );
      (async () => {
        const name = await contract.lineCount();
        console.log("contract name", name);
      })();
    } else {
      console.log("Sonnet not deployed to the network in question");
    }
  }, [network, provider]);

  return (
    <div className={styles.page}>
      <span>{account}</span>
      <button onClick={useContract}>hello do it</button>
      <Declaration size={size.toString()}>{text?.toString()}</Declaration>
    </div>
  );
};

export default Blockchain;
