import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// conversationId
// senderId
// role
// content
// createdAt
// meta

export const createMessage = mutation({
  args: {
    ownerId: v.string(),
    videoId: v.string(),
  },
  handler: async (ctx, { ownerId, videoId }) => {
    return await ctx.db.insert('conversations', {
      ownerId,
      videoId,
      createdAt: new Date().toISOString(),
    });
  },
});

export const getMessages = query({
  args: {
    ownerId: v.string(),
    videoId: v.string(),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db
      .query('conversations')
      .withIndex('by_owner_video', (q) =>
        q.eq('ownerId', args.ownerId).eq('videoId', args.videoId),
      )
      .collect();
    if (conversation) return conversation;
  },
});
