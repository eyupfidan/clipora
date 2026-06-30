export const NOTE_COLORS = [
  { name: "Default", value: "#ffffff" },
  { name: "Coral", value: "#faafa8" },
  { name: "Peach", value: "#f39f76" },
  { name: "Sand", value: "#fff8b8" },
  { name: "Mint", value: "#e2f6d3" },
  { name: "Sage", value: "#b4ddd3" },
  { name: "Fog", value: "#d4e4ed" },
  { name: "Storm", value: "#aeccdc" },
  { name: "Dusk", value: "#d3bfdb" },
  { name: "Blossom", value: "#f6e2dd" },
  { name: "Clay", value: "#e9e3d4" },
  { name: "Chalk", value: "#efeff1" }
] as const;

export const DEFAULT_NOTE_COLOR = NOTE_COLORS[0].value;
