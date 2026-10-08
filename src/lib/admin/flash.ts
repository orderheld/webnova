import "server-only";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export const FLASH_COOKIE = "wn_flash";

/**
 * Refreshes the admin and leaves a short confirmation ("Gespeichert", "Gelöscht" ...) that the
 * admin toaster shows once, also across redirects. Call at the end of a successful server action.
 */
export async function flashDone(text = "Gespeichert", kind: "ok" | "error" = "ok") {
  (await cookies()).set(FLASH_COOKIE, `${kind}|${Date.now()}|${encodeURIComponent(text)}`, { path: "/admin", maxAge: 20, sameSite: "lax" });
  revalidatePath("/admin", "layout");
}
