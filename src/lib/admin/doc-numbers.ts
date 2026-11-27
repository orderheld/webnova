/*
 * Customer and project numbers are derived from the database id, so they need no column of their own.
 * The offsets were raised on 2026-11-27 (customers were 10000 + id). Documents issued before keep the
 * number they were printed with: invoices.customer_number / quotes.customer_number hold that snapshot.
 */
export const CUSTOMER_NUMBER_OFFSET = 24316;
export const PROJECT_NUMBER_OFFSET = 3482;

/** Customer 1 → 24317 */
export const customerNumber = (id: number) => String(CUSTOMER_NUMBER_OFFSET + id);
/** Project 1 → PR-3483 */
export const projectNumber = (id: number) => `PR-${PROJECT_NUMBER_OFFSET + id}`;
