// lib/cipherEngine.js

const LOCAL_ENGINE_URL = "http://localhost:8000";

/**
 * Health check to verify local Python engine daemon is running
 */
export async function bootCipherEngine({ onProgress } = {}) {
  if (onProgress) {
    onProgress({ pct: 25, msg: "Pinging local engine on port 8000..." });
  }

  try {
    const res = await fetch(`${LOCAL_ENGINE_URL}/`);
    if (!res.ok) {
      throw new Error(`Engine ping failed with status: ${res.status}`);
    }

    if (onProgress) {
      onProgress({ pct: 75, msg: "Local hardware node confirmed active..." });
    }

    const data = await res.json();
    console.log("[Cipher Engine Connected]:", data);

    if (onProgress) {
      onProgress({ pct: 100, msg: "Engine ready." });
    }

    return true;
  } catch (err) {
    console.error("Local Engine Boot Failed:", err);
    throw new Error(
      "Could not connect to Cipher Engine daemon at http://localhost:8000. Ensure 'python backend/engine.py' is running locally."
    );
  }
}

/**
 * Sends prompt to FastAPI backend and returns generated text
 */
export async function generateCipherResponse(promptText) {
  try {
    const res = await fetch(`${LOCAL_ENGINE_URL}/v1/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: promptText }),
    });

    if (!res.ok) {
      throw new Error(`Inference request failed: ${res.statusText}`);
    }

    const json = await res.json();
    return json?.choices?.[0]?.message?.content || "No response generated from substrate.";
  } catch (err) {
    console.error("Inference execution failure:", err);
    return `[Substrate Execution Exception]: ${err.message}`;
  }
}
