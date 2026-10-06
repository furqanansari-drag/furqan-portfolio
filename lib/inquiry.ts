import { WHATSAPP } from "./data";

export type Inquiry = { name: string; email: string; whatsapp: string; type: string; message: string };

export function buildMessage(d: Inquiry): string {
  return [
    "*NEW PROJECT INQUIRY*",
    "",
    `*Name:* ${d.name}`,
    `*Email:* ${d.email}`,
    `*WhatsApp:* ${d.whatsapp || "Not provided"}`,
    `*Project Type:* ${d.type}`,
    "",
    "*Project Details:*",
    d.message,
    "",
    "Sent from the Furqan Ansari portfolio website.",
  ].join("\n");
}

export const waLink = (d: Inquiry) => `${WHATSAPP.link}?text=${encodeURIComponent(buildMessage(d))}`;

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number, maxLines: number): string[] {
  const lines: string[] = [];
  for (const para of text.split(/\r?\n/)) {
    let line = "";
    for (const word of para.split(/\s+/).filter(Boolean)) {
      const test = line ? line + " " + word : word;
      if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = word; } else line = test;
    }
    lines.push(line);
  }
  if (lines.length > maxLines) { const cut = lines.slice(0, maxLines); cut[maxLines - 1] = cut[maxLines - 1].replace(/\s*\S*$/, "") + "…"; return cut; }
  return lines;
}

// Draws the inquiry card to a canvas (1080x1350) and returns a PNG blob. Browser only.
export function drawCard(d: Inquiry): Promise<Blob> {
  const W = 1080, H = 1350;
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const x = c.getContext("2d")!;
  const font = (w: number, s: number) => `${w} ${s}px system-ui, "Segoe UI", Arial, sans-serif`;

  const bg = x.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0b1020"); bg.addColorStop(0.55, "#1b1650"); bg.addColorStop(1, "#06394a");
  x.fillStyle = bg; x.fillRect(0, 0, W, H);
  const glow = x.createRadialGradient(W - 120, 140, 10, W - 120, 140, 480);
  glow.addColorStop(0, "rgba(124,58,237,.5)"); glow.addColorStop(1, "rgba(124,58,237,0)");
  x.fillStyle = glow; x.fillRect(0, 0, W, H);

  // glass panel
  x.fillStyle = "rgba(255,255,255,.07)"; x.strokeStyle = "rgba(255,255,255,.18)"; x.lineWidth = 2;
  x.beginPath(); x.roundRect(60, 60, W - 120, H - 120, 40); x.fill(); x.stroke();

  // logo mark
  const lg = x.createLinearGradient(110, 110, 210, 210);
  lg.addColorStop(0, "#4f46e5"); lg.addColorStop(0.6, "#7c3aed"); lg.addColorStop(1, "#06b6d4");
  x.fillStyle = lg; x.beginPath(); x.roundRect(110, 110, 100, 100, 26); x.fill();
  x.strokeStyle = "#fff"; x.lineWidth = 9; x.lineCap = "round"; x.lineJoin = "round";
  x.beginPath(); x.moveTo(140, 186); x.lineTo(140, 138); x.lineTo(166, 138); x.moveTo(140, 162); x.lineTo(160, 162); x.stroke();
  x.beginPath(); x.moveTo(168, 186); x.lineTo(181, 138); x.lineTo(194, 186); x.moveTo(173, 173); x.lineTo(189, 173); x.stroke();

  x.fillStyle = "#fff"; x.font = font(800, 44); x.textBaseline = "alphabetic";
  x.fillText("FURQAN ANSARI", 235, 158);
  x.fillStyle = "#a5b4fc"; x.font = font(600, 24); x.fillText("AI • WEB • DIGITAL SOLUTIONS", 235, 195);

  x.fillStyle = "#67e8f9"; x.font = font(700, 26); x.fillText("PROJECT INQUIRY", 110, 320);
  x.fillStyle = "#fff"; x.font = font(800, 66); x.fillText(wrap(x, d.name, 860, 1)[0], 110, 400);

  x.fillStyle = "rgba(103,232,249,.15)"; x.beginPath(); x.roundRect(110, 440, 860, 74, 20); x.fill();
  x.fillStyle = "#67e8f9"; x.font = font(600, 22); x.fillText("PROJECT TYPE", 140, 470);
  x.fillStyle = "#fff"; x.font = font(700, 30); x.fillText(wrap(x, d.type, 800, 1)[0], 140, 503);

  x.fillStyle = "#a5b4fc"; x.font = font(600, 22); x.fillText("PROJECT DETAILS", 110, 580);
  x.fillStyle = "#e2e8f0"; x.font = font(400, 32);
  wrap(x, d.message, 860, 9).forEach((l, i) => x.fillText(l, 110, 630 + i * 46));

  x.strokeStyle = "rgba(255,255,255,.18)"; x.lineWidth = 2; x.beginPath(); x.moveTo(110, 1090); x.lineTo(970, 1090); x.stroke();
  x.fillStyle = "#a5b4fc"; x.font = font(600, 22); x.fillText("CLIENT CONTACT", 110, 1140);
  x.fillStyle = "#fff"; x.font = font(500, 30);
  x.fillText(wrap(x, d.email, 860, 1)[0], 110, 1184);
  x.fillText(d.whatsapp ? "WhatsApp: " + d.whatsapp : "WhatsApp: not provided", 110, 1228);
  x.fillStyle = "#94a3b8"; x.font = font(500, 22); x.textAlign = "right";
  x.fillText("To: " + WHATSAPP.display, 970, 1228); x.textAlign = "left";

  return new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error("toBlob failed"))), "image/png"));
}
