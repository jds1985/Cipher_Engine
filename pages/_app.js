import "../styles/globals.css";
import "../styles/cipher-theme.css"; // The core engine UI theme

import Head from "next/head";
import { useState, useEffect } from "react";
import EntryScreen from "../components/EntryScreen";

export default function MyApp({ Component, pageProps }) {
  const [entered, setEntered] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Look for local state only to see if they've booted the app session
      const hasEntered = localStorage.getItem("cipher_entered");
      if (hasEntered) setEntered(true);
    }
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#05060a" />
        {/* Aggressive privacy protections for local execution */}
        <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=()" />
      </Head>

      {/* Keeps the cool entrance wrapper for the local app, minus the broken redirect */}
      {!entered ? (
        <EntryScreen
          onEnter={() => {
            if (typeof window !== "undefined") {
              localStorage.setItem("cipher_entered", "true");
            }
            setEntered(true);
          }}
        />
      ) : (
        <Component {...pageProps} />
      )}
    </>
  );
}
