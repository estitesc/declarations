import * as React from "react";
import Redeclarations from "../abis/Redeclarations.json";
import { ethers } from "ethers";
import useNetwork from "./useNetwork";

const useMint = (ownerId?: string) => {
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
          let result;
          switch (ownerId) {
            case "esc":
              console.log("doing ESC mint");
              result = await contract.ownerMint(
                tokenUri,
                JSON.stringify(indices)
              );
              break;
            case "chase":
              result = await contract.owner2Mint(
                tokenUri,
                JSON.stringify(indices)
              );
              break;
            case "halim":
              result = await contract.owner3Mint(
                tokenUri,
                JSON.stringify(indices)
              );
              break;
            case "vv":
              console.log("doing VV mint");
              result = await contract.owner4Mint(
                tokenUri,
                JSON.stringify(indices)
              );
              break;
            default:
              console.log("doing Default Public mint");
              result = await contract.publicMint(
                tokenUri,
                JSON.stringify(indices)
              );
              break;
          }
          console.log("mint result", result);
        })();
      } else {
        console.log("Redeclarations not deployed to the network in question");
      }
    },
    [ownerId, setupNetwork]
  );

  return {
    mint,
  };
};

export default useMint;
