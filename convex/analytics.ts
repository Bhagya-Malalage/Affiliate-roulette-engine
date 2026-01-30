import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const logEvent = mutation({
  args: { eventType: v.string(), details: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await ctx.db.insert("analytics", {
      eventType: args.eventType,
      details: args.details,
      timestamp: Date.now(),
    });
  },
});
