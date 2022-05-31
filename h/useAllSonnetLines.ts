import * as React from "react";
import { ethers } from "ethers";
import Sonnet from "../abis/Sonnet.json";

const useAllSonnetLines = (setLines: (lines: any) => void) => {
  const getLinesData = React.useCallback(async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const net = await provider.getNetwork();
    const networkData = Sonnet.networks[net.chainId];

    const contract = new ethers.Contract(
      networkData.address,
      Sonnet.abi,
      provider
    );
    console.log("contract is", contract);

    const lineCount = await contract.lineCount();
    const loadedLines = [];
    for (var i = 0; i < lineCount; i++) {
      const line = await contract.lines(i);
      loadedLines.push(line);
    }
    setLines(loadedLines);
  }, [setLines]);

  React.useEffect(() => {
    getLinesData();
  }, [getLinesData]);
};

export default useAllSonnetLines;
