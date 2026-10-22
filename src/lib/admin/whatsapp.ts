/** International number for wa.me, or null for Swiss landlines (no WhatsApp) and anything unusable. */
export function whatsappNumber(phone: string | null): string | null {
  if (!phone) return null;
  const raw = phone.replace(/[^\d+]/g, "");
  const digits = raw.startsWith("+") ? raw.slice(1) : raw.startsWith("00") ? raw.slice(2) : raw.startsWith("0") ? `41${raw.slice(1)}` : raw;
  if (!/^\d{9,15}$/.test(digits)) return null;
  return digits.startsWith("41") && !digits.startsWith("417") ? null : digits;
}
