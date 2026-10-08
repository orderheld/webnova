"use server";

import { flashDone } from "./flash";

import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth";

export type ResetState = { error?: string; done?: { customers: number; quotes: number; invoices: number; projects: number } };

/**
 * Deletes all customers, quotes, invoices (incl. payments, reminders, credit notes), projects with
 * their tasks and time entries, and subscriptions. Leads, expenses, estimates, products, templates
 * and settings stay. Triggered only by the owner in Admin > Einstellungen, after typing LÖSCHEN.
 */
export async function resetBusinessDataAction(_: ResetState, fd: FormData): Promise<ResetState> {
  await requireAdmin();
  if (String(fd.get("confirm") ?? "").trim().toUpperCase() !== "LÖSCHEN") {
    return { error: "Bitte zur Bestätigung LÖSCHEN eintippen." };
  }
  const done = await db().transaction(async (tx) => {
    await tx.update(schema.leads).set({ customerId: null });
    await tx.delete(schema.subscriptions);
    await tx.delete(schema.timeEntries);
    await tx.delete(schema.projectTasks);
    const invoices = await tx.delete(schema.invoices).returning({ id: schema.invoices.id });
    const quotes = await tx.delete(schema.quotes).returning({ id: schema.quotes.id });
    const projects = await tx.delete(schema.projects).returning({ id: schema.projects.id });
    const customers = await tx.delete(schema.customers).returning({ id: schema.customers.id });
    return { customers: customers.length, quotes: quotes.length, invoices: invoices.length, projects: projects.length };
  });
  await flashDone("Daten gelöscht");
  return { done };
}
