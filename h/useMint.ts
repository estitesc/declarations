import * as React from "react";
import DeclTest0 from "../abis/DeclTest0.json";
import { ethers } from "ethers";
import useNetwork from "./useNetwork";

const useMint = () => {
  const { setupNetwork } = useNetwork();

  const mint = React.useCallback(
    async (tokenUri: string, indices: number[][]) => {
      const { provider, networkId } = await setupNetwork();

      console.log("network Id is", networkId);
      const networkData = DeclTest0.networks[networkId];
      if (networkData) {
        const contract = new ethers.Contract(
          networkData.address,
          DeclTest0.abi,
          provider.getSigner()
        );
        (async () => {
          const result = await contract.mint(tokenUri, indices);
          console.log("mint result", result);
        })();
      } else {
        console.log("DeclTest0 not deployed to the network in question");
      }
    },
    [setupNetwork]
  );

  return {
    mint,
  };
};

export default useMint;
