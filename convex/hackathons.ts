import { query } from "./_generated/server";

// The two reads the Android Hackathons screen needs. Both public — no auth,
// no pagination (five rows), newest deadline first is the client's job.
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("hackathons").collect();
  },
});

export const tags = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("hackathons").collect();
    return [...new Set(rows.map((h) => h.tag))].sort();
  },
});
