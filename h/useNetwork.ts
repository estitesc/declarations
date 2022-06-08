import { ethers } from "ethers";

const useNetwork = () => {
  const getProvider = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    return provider;
  };

  const getNetworkId = async (provider: ethers.providers.Web3Provider) => {
    const net = await provider.getNetwork();
    return net.chainId;
  };

  const getAccountAddress = async (provider: ethers.providers.Web3Provider) => {
    const signer = provider.getSigner();
    let userAddress = await signer.getAddress();
    return userAddress;
  };

  const setupNetwork = async () => {
    const provider = await getProvider();
    await provider.send("eth_requestAccounts", []);

    const networkId = await getNetworkId(provider);
    const accountAddress = await getAccountAddress(provider);

    return {
      provider,
      networkId,
      accountAddress,
    };
  };

  return {
    getProvider,
    getNetworkId,
    getAccountAddress,
    setupNetwork,
  };
};

export default useNetwork;
