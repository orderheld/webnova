import {
  boolean,
  date,
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const leadStatuses = ["neu", "kontaktiert", "offerte", "gewonnen", "verloren"] as const;
export type LeadStatus = (typeof leadStatuses)[number];

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  source: text("source").notNull().default("anfrage"),
  locale: text("locale").notNull().default("de"),
  name: text("name").notNull(),
  company: text("company"),
  email: text("email").notNull(),
  phone: text("phone"),
  preferredContact: text("preferred_contact"),
  services: text("services").array().notNull().default([]),
  hasWebsite: boolean("has_website"),
  websiteUrl: text("website_url"),
  companySize: text("company_size"),
  industry: text("industry"),
  budget: text("budget"),
  timeline: text("timeline"),
  message: text("message"),
  pageUrl: text("page_url"),
  status: text("status").$type<LeadStatus>().notNull().default("neu"),
  notes: text("notes"),
  customerId: integer("customer_id").references(() => customers.id, { onDelete: "set null" }),
});

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  company: text("company"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  phone: text("phone"),
  street: text("street"),
  zip: text("zip"),
  city: text("city"),
  country: text("country").notNull().default("CH"),
  language: text("language").notNull().default("de"),
  website: text("website"),
  notes: text("notes"),
});

export interface LineItem {
  title: string;
  description?: string;
  quantity: number;
  unit: string; // "Std.", "Pauschal", "Stk.", "Monat"
  unitPrice: number; // CHF, excl. VAT
}

export const quoteStatuses = ["entwurf", "gesendet", "angenommen", "abgelehnt"] as const;
export type QuoteStatus = (typeof quoteStatuses)[number];

export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  number: text("number").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  customerId: integer("customer_id")
    .notNull()
    .references(() => customers.id, { onDelete: "restrict" }),
  title: text("title").notNull(),
  intro: text("intro"),
  outro: text("outro"),
  items: jsonb("items").$type<LineItem[]>().notNull().default([]),
  discountPercent: numeric("discount_percent", { precision: 5, scale: 2, mode: "number" }).notNull().default(0),
  vatRate: numeric("vat_rate", { precision: 5, scale: 2, mode: "number" }).notNull().default(0),
  total: numeric("total", { precision: 12, scale: 2, mode: "number" }).notNull().default(0),
  issueDate: date("issue_date", { mode: "string" }).notNull(),
  validUntil: date("valid_until", { mode: "string" }),
  status: text("status").$type<QuoteStatus>().notNull().default("entwurf"),
  sentAt: timestamp("sent_at", { withTimezone: true }),
});

export const invoiceStatuses = ["entwurf", "gesendet", "bezahlt", "storniert"] as const;
export type InvoiceStatus = (typeof invoiceStatuses)[number];

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  number: text("number").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  customerId: integer("customer_id")
    .notNull()
    .references(() => customers.id, { onDelete: "restrict" }),
  quoteId: integer("quote_id").references(() => quotes.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  intro: text("intro"),
  outro: text("outro"),
  items: jsonb("items").$type<LineItem[]>().notNull().default([]),
  discountPercent: numeric("discount_percent", { precision: 5, scale: 2, mode: "number" }).notNull().default(0),
  vatRate: numeric("vat_rate", { precision: 5, scale: 2, mode: "number" }).notNull().default(0),
  total: numeric("total", { precision: 12, scale: 2, mode: "number" }).notNull().default(0),
  issueDate: date("issue_date", { mode: "string" }).notNull(),
  dueDate: date("due_date", { mode: "string" }).notNull(),
  status: text("status").$type<InvoiceStatus>().notNull().default("entwurf"),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  paidAt: date("paid_at", { mode: "string" }),
});

export interface EstimateData {
  hourlyRate: number;
  /** checked item ids with quantity */
  items: { id: string; qty: number }[];
  custom: { title: string; hours: number }[];
  riskPercent: number;
  marginNote?: string;
}

export const estimates = pgTable("estimates", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  name: text("name").notNull(),
  customerId: integer("customer_id").references(() => customers.id, { onDelete: "set null" }),
  leadId: integer("lead_id").references(() => leads.id, { onDelete: "set null" }),
  data: jsonb("data").$type<EstimateData>().notNull(),
  totalHours: numeric("total_hours", { precision: 8, scale: 2, mode: "number" }).notNull().default(0),
  total: numeric("total", { precision: 12, scale: 2, mode: "number" }).notNull().default(0),
});

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type Quote = typeof quotes.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
export type Estimate = typeof estimates.$inferSelect;
