import {
  type AnyPgColumn,
  boolean,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/** CRM pipeline stages, in board order. */
export const leadStatuses = ["neu", "kontaktiert", "gespraech", "offerte", "gewonnen", "verloren"] as const;
export type LeadStatus = (typeof leadStatuses)[number];

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  source: text("source").notNull().default("anfrage"),
  locale: text("locale").notNull().default("de"),
  name: text("name").notNull(),
  company: text("company"),
  // Manually added prospects often have no e-mail yet.
  email: text("email"),
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
  // CRM fields (own lead search, pipeline)
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  street: text("street"),
  zip: text("zip"),
  city: text("city"),
  /** 1 (very poor) to 5 (very good): rating of the prospect's current website */
  websiteRating: integer("website_rating"),
  websiteNotes: text("website_notes"),
  /** expected deal value in CHF */
  value: numeric("value", { precision: 12, scale: 2, mode: "number" }),
  followUpAt: date("follow_up_at", { mode: "string" }),
  lostReason: text("lost_reason"),
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
  industry: text("industry"),
  vatNumber: text("vat_number"),
  archived: boolean("archived").notNull().default(false),
});

export const billingIntervals = ["monat", "quartal", "halbjahr", "jahr"] as const;
export type BillingInterval = (typeof billingIntervals)[number];

export interface LineItem {
  title: string;
  description?: string;
  quantity: number;
  unit: string; // "Std.", "Pauschal", "Stk.", "Monat"
  unitPrice: number; // CHF, excl. VAT
  /** catalogue product the line came from */
  productId?: number | null;
  /** Quotes only: recurring fee, listed separately and not part of the one-time total */
  recurring?: BillingInterval | null;
  /** Quotes only: the first year of a recurring fee is included in the project price */
  firstYearIncluded?: boolean;
  /** Invoices: line generated from a subscription */
  subscriptionId?: number | null;
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
  leadId: integer("lead_id").references(() => leads.id, { onDelete: "set null" }),
  projectId: integer("project_id").references((): AnyPgColumn => projects.id, { onDelete: "set null" }),
  notes: text("notes"),
});

/** "gesendet" is shown as "Offen"; "überfällig" is derived from the due date. */
export const invoiceStatuses = ["entwurf", "gesendet", "teilbezahlt", "bezahlt", "storniert"] as const;
export type InvoiceStatus = (typeof invoiceStatuses)[number];
export type InvoiceKind = "rechnung" | "gutschrift";

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
  /** "rechnung" or "gutschrift" (credit note; amounts stay positive) */
  kind: text("kind").$type<InvoiceKind>().notNull().default("rechnung"),
  creditForId: integer("credit_for_id").references((): AnyPgColumn => invoices.id, { onDelete: "set null" }),
  projectId: integer("project_id").references((): AnyPgColumn => projects.id, { onDelete: "set null" }),
  /** sum of recorded payments, kept in sync by the payment actions */
  paidAmount: numeric("paid_amount", { precision: 12, scale: 2, mode: "number" }).notNull().default(0),
  reminderLevel: integer("reminder_level").notNull().default(0),
  notes: text("notes"),
});

export const payments = pgTable(
  "payments",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    invoiceId: integer("invoice_id")
      .notNull()
      .references(() => invoices.id, { onDelete: "cascade" }),
    date: date("date", { mode: "string" }).notNull(),
    amount: numeric("amount", { precision: 12, scale: 2, mode: "number" }).notNull(),
    method: text("method").notNull().default("bank"),
    note: text("note"),
  },
  (t) => [index("payments_invoice_idx").on(t.invoiceId), index("payments_date_idx").on(t.date)],
);

export const invoiceReminders = pgTable(
  "invoice_reminders",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    invoiceId: integer("invoice_id")
      .notNull()
      .references(() => invoices.id, { onDelete: "cascade" }),
    level: integer("level").notNull(),
    date: date("date", { mode: "string" }).notNull(),
    dueDate: date("due_date", { mode: "string" }).notNull(),
    fee: numeric("fee", { precision: 12, scale: 2, mode: "number" }).notNull().default(0),
    sentAt: timestamp("sent_at", { withTimezone: true }),
  },
  (t) => [index("invoice_reminders_invoice_idx").on(t.invoiceId)],
);

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

/* ───────────── CRM ───────────── */

export const contacts = pgTable(
  "contacts",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    customerId: integer("customer_id")
      .notNull()
      .references(() => customers.id, { onDelete: "cascade" }),
    firstName: text("first_name"),
    lastName: text("last_name"),
    role: text("role"),
    email: text("email"),
    phone: text("phone"),
    isPrimary: boolean("is_primary").notNull().default(false),
    notes: text("notes"),
  },
  (t) => [index("contacts_customer_idx").on(t.customerId)],
);

export const activityTypes = ["anruf", "email", "meeting", "notiz", "system"] as const;
export type ActivityType = (typeof activityTypes)[number];

export const activities = pgTable(
  "activities",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).defaultNow().notNull(),
    type: text("type").$type<ActivityType>().notNull().default("notiz"),
    body: text("body").notNull(),
    leadId: integer("lead_id").references(() => leads.id, { onDelete: "cascade" }),
    customerId: integer("customer_id").references(() => customers.id, { onDelete: "cascade" }),
    projectId: integer("project_id").references((): AnyPgColumn => projects.id, { onDelete: "cascade" }),
  },
  (t) => [
    index("activities_lead_idx").on(t.leadId),
    index("activities_customer_idx").on(t.customerId),
    index("activities_project_idx").on(t.projectId),
  ],
);

/* ───────────── Catalogue (Leistungen) ───────────── */

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category"),
  unit: text("unit").notNull().default("Pauschal"),
  /** CHF excl. VAT */
  price: numeric("price", { precision: 12, scale: 2, mode: "number" }).notNull().default(0),
  /** set for recurring services (hosting, maintenance, domain …) */
  interval: text("interval").$type<BillingInterval>(),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

/* ───────────── Projects ───────────── */

export const projectStatuses = ["planung", "design", "entwicklung", "review", "live", "abgeschlossen"] as const;
export type ProjectStatus = (typeof projectStatuses)[number];

export interface ProjectLink {
  label: string;
  url: string;
}

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  name: text("name").notNull(),
  customerId: integer("customer_id")
    .notNull()
    .references(() => customers.id, { onDelete: "restrict" }),
  quoteId: integer("quote_id").references((): AnyPgColumn => quotes.id, { onDelete: "set null" }),
  leadId: integer("lead_id").references(() => leads.id, { onDelete: "set null" }),
  status: text("status").$type<ProjectStatus>().notNull().default("planung"),
  startDate: date("start_date", { mode: "string" }),
  dueDate: date("due_date", { mode: "string" }),
  liveDate: date("live_date", { mode: "string" }),
  budget: numeric("budget", { precision: 12, scale: 2, mode: "number" }),
  hourlyRate: numeric("hourly_rate", { precision: 8, scale: 2, mode: "number" }),
  description: text("description"),
  notes: text("notes"),
  links: jsonb("links").$type<ProjectLink[]>().notNull().default([]),
});

export const projectTasks = pgTable(
  "project_tasks",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    notes: text("notes"),
    dueDate: date("due_date", { mode: "string" }),
    milestone: boolean("milestone").notNull().default(false),
    done: boolean("done").notNull().default(false),
    doneAt: timestamp("done_at", { withTimezone: true }),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("project_tasks_project_idx").on(t.projectId)],
);

export const timeEntries = pgTable(
  "time_entries",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    date: date("date", { mode: "string" }).notNull(),
    hours: numeric("hours", { precision: 6, scale: 2, mode: "number" }).notNull(),
    rate: numeric("rate", { precision: 8, scale: 2, mode: "number" }).notNull().default(0),
    description: text("description").notNull(),
    billable: boolean("billable").notNull().default(true),
    invoiceId: integer("invoice_id").references(() => invoices.id, { onDelete: "set null" }),
  },
  (t) => [index("time_entries_project_idx").on(t.projectId)],
);

export interface TemplateTask {
  title: string;
  /** due date = project start + offsetDays */
  offsetDays: number;
  milestone?: boolean;
}

export const projectTemplates = pgTable("project_templates", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  name: text("name").notNull(),
  description: text("description"),
  tasks: jsonb("tasks").$type<TemplateTask[]>().notNull().default([]),
  /** catalogue products that pre-fill a quote */
  productIds: integer("product_ids").array().notNull().default([]),
});

/* ───────────── Recurring billing (Abos) ───────────── */

export const subscriptionStatuses = ["aktiv", "pausiert", "gekuendigt"] as const;
export type SubscriptionStatus = (typeof subscriptionStatuses)[number];

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    customerId: integer("customer_id")
      .notNull()
      .references(() => customers.id, { onDelete: "restrict" }),
    projectId: integer("project_id").references(() => projects.id, { onDelete: "set null" }),
    quoteId: integer("quote_id").references(() => quotes.id, { onDelete: "set null" }),
    productId: integer("product_id").references(() => products.id, { onDelete: "set null" }),
    /** hosting, wartung, domain, seo, lizenz, andere */
    category: text("category").notNull().default("hosting"),
    title: text("title").notNull(),
    description: text("description"),
    /** price per interval, excl. VAT */
    amount: numeric("amount", { precision: 12, scale: 2, mode: "number" }).notNull(),
    interval: text("interval").$type<BillingInterval>().notNull().default("jahr"),
    startDate: date("start_date", { mode: "string" }).notNull(),
    /** first year included in the project price: billing starts 12 months after the start */
    firstYearIncluded: boolean("first_year_included").notNull().default(false),
    nextBillingDate: date("next_billing_date", { mode: "string" }).notNull(),
    endDate: date("end_date", { mode: "string" }),
    status: text("status").$type<SubscriptionStatus>().notNull().default("aktiv"),
    lastInvoiceId: integer("last_invoice_id").references(() => invoices.id, { onDelete: "set null" }),
    notes: text("notes"),
  },
  (t) => [index("subscriptions_customer_idx").on(t.customerId), index("subscriptions_next_idx").on(t.nextBillingDate)],
);

/* ───────────── Expenses (Ausgaben) ───────────── */

export const expenses = pgTable(
  "expenses",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    date: date("date", { mode: "string" }).notNull(),
    category: text("category").notNull().default("diverses"),
    description: text("description").notNull(),
    supplier: text("supplier"),
    /** gross amount paid, CHF */
    amount: numeric("amount", { precision: 12, scale: 2, mode: "number" }).notNull(),
    /** input tax contained in the amount (Vorsteuer) */
    vatAmount: numeric("vat_amount", { precision: 12, scale: 2, mode: "number" }).notNull().default(0),
    customerId: integer("customer_id").references(() => customers.id, { onDelete: "set null" }),
    projectId: integer("project_id").references(() => projects.id, { onDelete: "set null" }),
    receiptUrl: text("receipt_url"),
    notes: text("notes"),
  },
  (t) => [index("expenses_date_idx").on(t.date)],
);

export type Lead = typeof leads.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type Quote = typeof quotes.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
export type Estimate = typeof estimates.$inferSelect;
export type Contact = typeof contacts.$inferSelect;
export type Activity = typeof activities.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type ProjectTask = typeof projectTasks.$inferSelect;
export type TimeEntry = typeof timeEntries.$inferSelect;
export type ProjectTemplate = typeof projectTemplates.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type Expense = typeof expenses.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type InvoiceReminder = typeof invoiceReminders.$inferSelect;
