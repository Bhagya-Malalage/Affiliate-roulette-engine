import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  analytics: defineTable({
    eventType: v.string(), // "spin", "win", "cta_click"
    details: v.optional(v.string()), // e.g. "bet on 12"
    timestamp: v.number(),
  }),
});
