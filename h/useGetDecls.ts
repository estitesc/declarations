import { ethers } from "ethers";
import * as React from "react";
import Redeclarations from "../abis/Redeclarations.json";
import useNetwork from "./useNetwork";

const useGetDecls = () => {
  const { setupNetwork } = useNetwork();
  return React.useCallback(async () => {
    const { provider, networkId } = await setupNetwork();
    // @ts-ignore
    const networkData = Redeclarations.networks[networkId];
    const contract = new ethers.Contract(
      networkData.address,
      Redeclarations.abi,
      provider
    );
    const publicMintCount = await contract.publicMintCount();
    const ownerMintCount = await contract.ownerMintCount();
    const owner2MintCount = await contract.owner2MintCount();
    const owner3MintCount = await contract.owner3MintCount();
    const owner4MintCount = await contract.owner4MintCount();
    const totalMintCount =
      publicMintCount.toNumber() +
      ownerMintCount.toNumber() +
      owner2MintCount.toNumber() +
      owner3MintCount.toNumber() +
      owner4MintCount.toNumber();

    const loadedDecls = [];
    for (var i = 0; i < totalMintCount; i++) {
      const declaration = await contract.declarations(i);
      loadedDecls.push(declaration);
    }

    return loadedDecls;
  }, [setupNetwork]);
};

export default useGetDecls;
