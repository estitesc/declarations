import React from "react";
import type { NextPage } from "next";
import styles from "../styles/Declaration.module.css";
import useNetworkDetails from "../h/useNetworkDetails";
import useMint from "../h/useMint";

declare global {
  interface Window {
    ethereum: any;
  }
}

const Blockchain: NextPage = () => {
  const [account, setAccount] = React.useState("");
  const [network, setNetwork] = React.useState(1);
  const [provider, setProvider] = React.useState(undefined as any);
  const [imageUrl, setImageUrl] = React.useState("");
  const [indices, setIndices] = React.useState("[[0, 1],[2, 3]]");

  useNetworkDetails(setProvider, setNetwork, setAccount);
  const { mint } = useMint();

  const submitMint = React.useCallback(() => {
    try {
      const parsedIndices = JSON.parse(indices);
      console.log("parsed is", parsedIndices);

      let validIndices = true;
      parsedIndices.forEach((indexPair: number[]) => {
        if (indexPair.length != 2) {
          console.log("Invalid array format");
          validIndices = false;
        }
        if (typeof indexPair[0] != "number") {
          console.log("Invalid index contents");
          validIndices = false;
        }
        if (typeof indexPair[1] != "number") {
          console.log("Invalid index contents");
          validIndices = false;
        }
      });

      if (!validIndices) {
        return;
      }

      if (!imageUrl) {
        console.log("must supply image url");
        return;
      }

      console.log("got through", imageUrl, parsedIndices);
      mint(imageUrl, parsedIndices);
    } catch (e) {
      console.log("error parsing indices into proper JSON", e);
    }
  }, [imageUrl, indices, mint]);

  return (
    <div className={styles.page}>
      <div>account: {account}</div>
      <div>
        <div>
          Image URL:
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>
        <div>
          Selection Indices:
          <input value={indices} onChange={(e) => setIndices(e.target.value)} />
        </div>
      </div>
      <button onClick={submitMint}>mint one</button>
    </div>
  );
};

export default Blockchain;
