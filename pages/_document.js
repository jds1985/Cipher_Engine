import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Injects ONNX Runtime WebGPU directly into the browser scope for local processing */}
        <script 
          src="https://cdn.jsdelivr.net/npm/onnxruntime-web@1.19.2/dist/ort.webgpu.min.js"
          defer
        />

        {/* PWA Manifest & App Icons for the local desktop/mobile application */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/cipher_icon_512.png" />
        <link rel="apple-touch-icon" href="/icons/cipher_icon_192.png" />
        <meta name="theme-color" content="#000000" />

        {/* Adjust to () if Cipher doesn't need audio/video inputs */}
        <meta
          httpEquiv="Permissions-Policy"
          content="camera=(), microphone=()"
        />

        {/* Service Worker for caching local engine assets / offline availability */}
        <link rel="serviceworker" href="/sw.js" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
