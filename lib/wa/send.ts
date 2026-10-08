const VERSION = process.env.WHATSAPP_API_VERSION || "v23.0";

export async function sendText(to: string, body: string): Promise<void> {
  const id = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_TOKEN;
  if (!id || !token) throw new Error("WhatsApp env vars missing");
  const res = await fetch(`https://graph.facebook.com/${VERSION}/${id}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", to, type: "text", text: { body: body.slice(0, 4000), preview_url: false } }),
  });
  if (!res.ok) throw new Error(`WhatsApp send failed (${res.status})`);
}

// Furqan ko alert (Telegram bot, free). Set na ho to chup-chaap skip.
export async function notifyOwner(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return;
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chat, text: text.slice(0, 3500), disable_web_page_preview: true }),
  });
  if (!res.ok) throw new Error(`Telegram send failed (${res.status})`);
}
