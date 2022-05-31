import { ethers } from "ethers";
import React from "react";

const useNetworkDetails = async (
  setProvider: (provider: any) => void,
  setNetwork: (network: any) => void,
  setAccount: (account: string) => void
) => {
  const getNetworkData = React.useCallback(async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    const net = await provider.getNetwork();
    setNetwork(net.chainId);

    let userAddress = await signer.getAddress();
    setAccount(userAddress);
    console.log("got user address", userAddress);
  }, [setAccount, setNetwork, setProvider]);

  React.useEffect(() => {
    getNetworkData();
  }, [getNetworkData]);
};

export default useNetworkDetails;
