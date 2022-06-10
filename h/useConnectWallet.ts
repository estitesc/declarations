import { ethers } from "ethers";

const useConnectWallet = () => {
  const connectWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    console.log("Account:", address);
    return address;
  };

  return connectWallet;
};

export default useConnectWallet;
