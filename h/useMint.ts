import * as React from "react";
import DeclTest1 from "../abis/DeclTest1.json";
import { ethers } from "ethers";
import useNetwork from "./useNetwork";

const useMint = () => {
  const { setupNetwork } = useNetwork();

  const mint = React.useCallback(
    async (tokenUri: string, indices: number[][]) => {
      const { provider, networkId } = await setupNetwork();

      // @ts-ignore
      const networkData = DeclTest1.networks[networkId];
      if (networkData) {
        const contract = new ethers.Contract(
          networkData.address,
          DeclTest1.abi,
          provider.getSigner()
        );
        (async () => {
          const result = await contract.mint(tokenUri, indices);
          console.log("mint result", result);
        })();
      } else {
        console.log("DeclTest1 not deployed to the network in question");
      }
    },
    [setupNetwork]
  );

  return {
    mint,
  };
};

export default useMint;
