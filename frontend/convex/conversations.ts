import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createConversation = mutation({
  args: {
    ownerId: v.string(),
    videoId: v.string(),
  },
  handler: async (ctx, { ownerId, videoId }) => {
    const conv = await ctx.db
      .query("conversations")
      .withIndex("by_owner_video", (e) =>
        e.eq("ownerId", ownerId).eq("videoId", videoId),
      )
      .collect();
    if (conv.length > 0) return conv;
    return await ctx.db.insert("conversations", {
      ownerId,
      videoId,
      createdAt: new Date().toISOString(),
    });
  },
});

export const getConversation = query({
  args: {
    ownerId: v.string(),
    videoId: v.string(),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db
      .query("conversations")
      .withIndex("by_owner_video", (q) =>
        q.eq("ownerId", args.ownerId).eq("videoId", args.videoId),
      )
      .collect();
    return conversation;
  },
});
