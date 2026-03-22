import { cookies } from "next/headers";
import { prisma } from "./db";

/**
 * Server-side check: does the current request have a valid purchase token?
 * In dev, checks the `lefilon_dev_paid` cookie (togglable via DevFab).
 */
export async function hasValidAccess(): Promise<boolean> {
  const cookieStore = await cookies();

  if (process.env.NODE_ENV === "development") {
    const devPaid = cookieStore.get("lefilon_dev_paid")?.value;
    return devPaid === "true";
  }

  const token = cookieStore.get("lefilon_access")?.value;
  if (!token) return false;

  const purchase = await prisma.purchase.findUnique({
    where: { token },
  });

  return !!purchase;
}
