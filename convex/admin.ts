import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./auth";

// Writes for the admin portal. Every mutation requires a valid session
// token from `auth:login`; reads (hackathons.ts) stay public for the app.
const fields = {
  title: v.string(),
  organizer: v.string(),
  description: v.string(),
  location: v.string(),
  startsOn: v.string(),
  endsOn: v.string(),
  deadline: v.string(),
  prize: v.string(),
  tag: v.string(),
  dateDisplay: v.optional(v.string()),
  deadlineDisplay: v.optional(v.string()),
  websiteUrl: v.optional(v.string()),
  status: v.optional(v.string()),
  isFeatured: v.optional(v.boolean()),
};

const ALLOWED_STATUSES = ["Upcoming", "Ongoing", "Completed", "Cancelled"];
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function validate(args: Record<string, unknown>) {
  const str = (k: string) => args[k] as string;
  if (!str("title") || str("title").length > 120)
    throw new Error("Title is required (max 120 chars)");
  if (!str("organizer") || str("organizer").length > 120)
    throw new Error("Organizer is required (max 120 chars)");
  if (str("description").length > 5000)
    throw new Error("Description is too long (max 5000 chars)");
  if (str("location").length > 120) throw new Error("Location too long");
  for (const k of ["startsOn", "endsOn", "deadline"] as const) {
    if (str(k) && !ISO_DATE.test(str(k)))
      throw new Error(`${k} must be an ISO date (YYYY-MM-DD)`);
  }
  if (str("startsOn") && str("endsOn") && str("endsOn") < str("startsOn"))
    throw new Error("endsOn must not be before startsOn");
  if (str("prize").length > 60) throw new Error("Prize too long");
  if (!str("tag") || str("tag").length > 60)
    throw new Error("Tag is required (max 60 chars)");
  const url = str("websiteUrl");
  if (url && !/^https?:\/\//i.test(url))
    throw new Error("websiteUrl must start with http:// or https://");
  const status = str("status");
  if (status && !ALLOWED_STATUSES.includes(status))
    throw new Error(`Status must be one of: ${ALLOWED_STATUSES.join(", ")}`);
}

export const create = mutation({
  args: { token: v.string(), ...fields },
  handler: async (ctx, { token, ...args }) => {
    await requireAdmin(ctx, token);
    validate(args);
    return await ctx.db.insert("hackathons", { ...args, participants: 0 });
  },
});

export const update = mutation({
  args: { id: v.id("hackathons"), token: v.string(), ...fields },
  handler: async (ctx, { id, token, ...rest }) => {
    await requireAdmin(ctx, token);
    validate(rest);
    await ctx.db.patch(id, rest);
  },
});

export const remove = mutation({
  args: { id: v.id("hackathons"), token: v.string() },
  handler: async (ctx, { id, token }) => {
    await requireAdmin(ctx, token);
    await ctx.db.delete(id);
  },
});
