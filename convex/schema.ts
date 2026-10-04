import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The app's whole backend, for now: the hackathon directory. No auth, no
// writes — the app has no login, so every row here is public content and the
// only operations are reads. Dates are ISO `yyyy-MM-dd` strings, matching the
// Android model's contract (display form is built client-side for countdowns).
export default defineSchema({
  hackathons: defineTable({
    title: v.string(),
    organizer: v.string(),
    description: v.string(),
    location: v.string(),
    startsOn: v.string(),
    endsOn: v.string(),
    deadline: v.string(),
    prize: v.string(),
    participants: v.number(),
    tag: v.string(),
    // Admin-portal extras. Optional so the Android read path never depends on
    // them: the display strings are the portal's richness, the ISO dates above
    // are the contract.
    dateDisplay: v.optional(v.string()),
    deadlineDisplay: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    status: v.optional(v.string()),
    isFeatured: v.optional(v.boolean()),
  }).index("by_tag", ["tag"]),

  // Admin portal login. Emails unique; passwords stored as SHA-256 hex.
  admins: defineTable({
    email: v.string(),
    passwordHash: v.string(),
  }).index("by_email", ["email"]),

  // Feedback sent from the Android app. Public to write, admin-only to read.
  feedbacks: defineTable({
    name: v.optional(v.string()),
    rating: v.optional(v.number()),
    message: v.string(),
    createdAt: v.number(),
  }),

  // Bearer tokens issued by auth:login; required for every admin mutation.
  adminSessions: defineTable({
    token: v.string(),
    expiresAt: v.number(),
  }).index("by_token", ["token"]),
});
