import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createMessage = mutation({
  args: {
    content: v.string(),
    conversationId: v.string(),
    senderId: v.string(),
    role: v.union(v.literal("USER"), v.literal("ASSISTANT")),
  },
  handler: async (ctx, { content, role, conversationId, senderId }) => {
    return await ctx.db.insert("messages", {
      content,
      role,
      createdAt: new Date().toISOString(),
      conversationId,
      senderId,
    });
  },
});

export const getMessages = query({
  args: {
    conversationId: v.string(),
    senderId: v.string(),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_sender_conversation", (q) =>
        q
          .eq("conversationId", args.conversationId)
          .eq("senderId", args.senderId)
      )
      .collect();
    return messages;
  },
});
