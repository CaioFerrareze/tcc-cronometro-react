import React, { useState, useEffect, useRef } from "react";

export default function App() {
  const [cronometros, setCronometros] = useState([0]);
  const [formato, setFormato] = useState("mm:ss");
  const [voltas, setVoltas] = useState({});

  const toggleFormato = () => {
    setFormato((prev) => (prev === "mm:ss" ? "hh:mm:ss" : "mm:ss"));
  };

  return (
    <div style={{ textAlign: "center", fontFamily: "sans-serif", padding: 16 }}>
      <h2>Cronômetro Interativo (React)</h2>

      <button onClick={toggleFormato}>Alternar formato ({formato})</button>

      <button
        style={{ marginLeft: 8 }}
        onClick={() => setCronometros((prev) => [...prev, prev.length])}
      >
        Adicionar Cronômetro
      </button>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 16,
          marginTop: 16,
        }}
      >
        {cronometros.map((id) => (
          <Cronometro
            key={id}
            id={id}
            formato={formato}
            voltas={voltas[id] || []}
            onVoltasChange={(v) =>
              setVoltas((prev) => ({ ...prev, [id]: v }))
            }
          />
        ))}
      </div>
    </div>
  );
}

function Cronometro({ formato, voltas, onVoltasChange }) {
  const [tempo, setTempo] = useState(0);
  const [rodando, setRodando] = useState(false);
  const intervalo = useRef(null);

  useEffect(() => {
    if (rodando) {
      intervalo.current = setInterval(() => setTempo((t) => t + 100), 100);
    } else {
      clearInterval(intervalo.current);
    }
    return () => clearInterval(intervalo.current);
  }, [rodando]);

  const formatarTempo = (ms) => {
    const totalSeg = Math.floor(ms / 1000);
    const horas = Math.floor(totalSeg / 3600);
    const minutos = Math.floor((totalSeg % 3600) / 60);
    const segundos = totalSeg % 60;

    if (formato === "hh:mm:ss")
      return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(
        2,
        "0"
      )}:${String(segundos).padStart(2, "0")}`;
    return `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(
      2,
      "0"
    )}`;
  };

  const registrarVolta = () => onVoltasChange([...(voltas || []), tempo]);

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: 16,
        borderRadius: 8,
        width: 240,
      }}
    >
      <h3>{formatarTempo(tempo)}</h3>
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        <button onClick={() => setRodando((r) => !r)}>
          {rodando ? "Pausar" : "Iniciar"}
        </button>
        <button onClick={() => setTempo(0)}>Zerar</button>
        <button onClick={registrarVolta}>Volta</button>
      </div>
      <ul style={{ textAlign: "left", marginTop: 10 }}>
        {(voltas || []).map((v, i) => (
          <li key={i}>
            Volta {i + 1}: {formatarTempo(v)}
          </li>
        ))}
      </ul>
    </div>
  );
}
