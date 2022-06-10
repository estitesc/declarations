import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Mint.module.css";
import DeclarationOfIndependence from "../c/DeclarationOfIndependence";
import clsx from "clsx";
import { Logo } from "../c/Logo";
import EmailForm from "../c/EmailForm";
import TextSelector from "../c/TextSelector";
import { declarationText } from "../utils/declarationText";
import useConnectWallet from "../h/useConnectWallet";

const Mint: NextPage = () => {
  const [selection, setSelection] = React.useState(null);
  const [textSelKey, setTextSelKey] = React.useState(0);
  const [walletAddress, setWalletAddress] = React.useState("");

  console.log(selection);

  const connectWallet = useConnectWallet();
  const connectWalletAndStoreAddress = React.useCallback(async () => {
    const address = await connectWallet();
    setWalletAddress(address);
  }, [connectWallet]);

  return (
    <div className={styles.container}>
      <div>
        <header className={styles.header}>
          {/* <h1 className={styles.title + ' fluid-type'}>
            <span>█▓▒░</span>Redeclarations
          </h1> */}
          <Logo />
          <p className={styles.subtitle + " fluid-type"}>
            A reclaiming of the Declaration of Independence by those who never
            signed it.
          </p>
        </header>

        <button onClick={connectWalletAndStoreAddress}>connect wallet</button>
        <button
          onClick={() => {
            setSelection(null);
            setTextSelKey(textSelKey + 1);
          }}
          disabled={selection === null || selection === ""}
        >
          Reset
        </button>

        <TextSelector
          key={textSelKey}
          text={declarationText}
          onChange={(selection) => setSelection(selection)}
        />

        {/* <div className={styles.intro}>
          <p>
            The Declaration of Independence marked America’s exit from the
            British Empire. Redeclarations are an invitation to depart again,
            break from today’s America, and embrace a redefined nation. By
            minting bits of the old declaration, we’re taking ownership of this
            nation’s founding document and redeclaring this country.
          </p>

          <p>
            A revolution never concludes. A country is an eternal dream dreamt
            by all its people, old and new. Out of the 56 signatories of the
            original declaration, 8 were immigrants. None were Natives.
            Redeclarations resets and corrects the beginnings of this country by
            giving all of its parts a voice.
          </p>

          <p>
            The new signatories will be able to select the words and sentences
            of the Declaration that speak to them. Their selections will be a
            collective erasure of the past, a revealing of new potential
            meanings within the original document, and a seeding of kernels of
            unexplored futures.
          </p>

          <p>
            As the project evolves, the declaration will evolve into a
            marked—and colorful—document, a communitarian revision of the
            original where each signatory can claim a literal space and a
            colorscape.
          </p>
        </div>

        <EmailForm
          actionUrl='https://gmail.us9.list-manage.com/subscribe/post?u=5c6722630f29edfbab3f9a71b&amp;id=fcf5cacf14'
          onSuccess={() => {}}
        /> */}

        {/* <div className={styles.oulipo}>
          xoxo,
          <br /> — 0u1ip0
        </div> */}
      </div>

      {/* <DeclarationOfIndependence /> */}
    </div>
  );
};

export default Mint;
