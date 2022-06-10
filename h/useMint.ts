import * as React from "react";
import Redeclarations from "../abis/Redeclarations.json";
import { ethers } from "ethers";
import useNetwork from "./useNetwork";

const useMint = () => {
  const { setupNetwork } = useNetwork();

  const mint = React.useCallback(
    async (tokenUri: string, indices: number[][]) => {
      const { provider, networkId } = await setupNetwork();

      // @ts-ignore
      const networkData = Redeclarations.networks[networkId];
      if (networkData) {
        const contract = new ethers.Contract(
          networkData.address,
          Redeclarations.abi,
          provider.getSigner()
        );
        (async () => {
          const result = await contract.publicMint(
            tokenUri,
            JSON.stringify(indices)
          );
          console.log("mint result", result);
        })();
      } else {
        console.log("Redeclarations not deployed to the network in question");
      }
    },
    [setupNetwork]
  );

  return {
    mint,
  };
};

export default useMint;
