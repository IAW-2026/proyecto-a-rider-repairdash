const DEFAULT_ENDPOINT = "https://proyecto-a-rider-repairdash.vercel.app/api/repairdash/statetravel";
const DEFAULT_ID_VIAJE = null;
const DEFAULT_INTERVAL_MS = 5000;
const CANCEL_CHANCE = 0.1; // 10% chance to cancel on any tick
const STOP_ON_FINAL_STATE = true;

const STATUS_FLOW = ["aceptado", "en camino", "en puerta", "finalizado"];

function getArgValue(name, fallback) {
  const prefix = `--${name}=`;
  const arg = process.argv.find((entry) => entry.startsWith(prefix));
  if (!arg) return fallback;
  const value = arg.slice(prefix.length);
  return value.length ? value : fallback;
}

function getRandomId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `drv_${Math.random().toString(36).slice(2, 10)}`;
}

async function sendState({ endpoint, idViaje, estado, idDriver }) {
  const payload = {
    id_viaje: Number(idViaje),
    estado,
  };

  if (idDriver) {
    payload.id_driver = idDriver;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json",
                "x-api-key":"REPAIRDASH_API_KEY"
     },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  return response;
}

async function main() {
  const endpoint = getArgValue("endpoint", DEFAULT_ENDPOINT);
  const idViaje = getArgValue("id", DEFAULT_ID_VIAJE);
  const intervalMs = Number(getArgValue("interval", DEFAULT_INTERVAL_MS));
  const forceCancel = process.argv.includes("--cancel");

  if (!idViaje) {
    console.error("[statetravel-mock] missing --id. Example: --id=123");
    process.exit(1);
  }

  let stepIndex = 0;
  let idDriver = null;
  let finalState = null;

  console.log("[statetravel-mock] endpoint:", endpoint);
  console.log("[statetravel-mock] id_viaje:", idViaje);
  console.log("[statetravel-mock] interval:", intervalMs, "ms");
  console.log("[statetravel-mock] force cancel:", forceCancel);

  const tick = async () => {
    if (finalState && STOP_ON_FINAL_STATE) {
      return;
    }

    if (!finalState && forceCancel) {
      finalState = "cancelado";
    }

    if (!finalState && Math.random() < CANCEL_CHANCE) {
      finalState = "cancelado";
    }

    const estado = finalState ?? STATUS_FLOW[stepIndex];

    if (estado === "aceptado" && !idDriver) {
      idDriver = getRandomId();
    }

    try {
      await sendState({ endpoint, idViaje, estado, idDriver });
      console.log(`[statetravel-mock] estado=${estado} id_driver=${idDriver ?? "-"}`);
    } catch (error) {
      console.error("[statetravel-mock] error:", error.message);
    }

    if (!finalState) {
      stepIndex = Math.min(stepIndex + 1, STATUS_FLOW.length - 1);
      if (STATUS_FLOW[stepIndex] === "finalizado") {
        finalState = "finalizado";
      }
    }

    if (finalState && STOP_ON_FINAL_STATE) {
      console.log(`[statetravel-mock] final state: ${finalState}. Stopping.`);
      clearInterval(timerId);
    }
  };

  await tick();
  const timerId = setInterval(tick, intervalMs);
}

main().catch((error) => {
  console.error("[statetravel-mock] fatal:", error.message);
  process.exit(1);
});
