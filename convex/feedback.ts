import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./auth";

// User feedback from the Android app.

export const create = mutation({
  args: {
    name: v.optional(v.string()),
    rating: v.optional(v.number()),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const message = args.message.trim();
    if (message.length < 3 || message.length > 2000) {
      throw new Error("Message must be 3-2000 characters");
    }
    const name = args.name?.trim();
    if (name !== undefined && name.length > 100) {
      throw new Error("Name must be at most 100 characters");
    }
    const rating = args.rating;
    if (rating !== undefined && (rating < 1 || rating > 5 || !Number.isInteger(rating))) {
      throw new Error("Rating must be an integer 1-5");
    }
    await ctx.db.insert("feedbacks", {
      name: name && name.length > 0 ? name : undefined,
      rating,
      message,
      createdAt: Date.now(),
    });
  },
});

export const list = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);
    return await ctx.db.query("feedbacks").order("desc").collect();
  },
});

export const remove = mutation({
  args: { token: v.string(), id: v.id("feedbacks") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);
    await ctx.db.delete(args.id);
  },
});
