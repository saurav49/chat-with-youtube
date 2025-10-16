import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  conversations: defineTable({
    ownerId: v.string(),
    videoId: v.string(),
    createdAt: v.string(),
  }).index('by_owner_video', ['ownerId', 'videoId']),

  messages: defineTable({
    conversationId: v.string(),
    senderId: v.string(),
    role: v.union(v.literal('USER'), v.literal('ASSISTANT')),
    content: v.string(),
    createdAt: v.string(),
    meta: v.optional(v.any()),
  }).index('by_conversation_time', ['conversationId', 'createdAt']),
});
