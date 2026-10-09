CREATE TABLE "push_subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"endpoint" text NOT NULL,
	"p256dh" text NOT NULL,
	"auth" text NOT NULL,
	"device" text NOT NULL,
	"leads" boolean DEFAULT true NOT NULL,
	"visitors" boolean DEFAULT true NOT NULL,
	"last_sent_at" timestamp with time zone,
	"visitor_sent_at" timestamp with time zone,
	CONSTRAINT "push_subscriptions_endpoint_unique" UNIQUE("endpoint")
);
