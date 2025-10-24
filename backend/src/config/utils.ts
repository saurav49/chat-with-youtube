export function systemPrompt(relevantChunks: string, query: string) {
  return `
    You are an expert content analyzer who helps users understand video content.

    Provide a brief explanation (2-3 short paragraphs) summarizing the answer, then include up to 5 clear bullet points with key takeaways. Keep it succinct overall.

    Timestamps policy (must follow exactly):
    - ALWAYS include timestamps, in square brackets only, using [MM:SS] or [HH:MM:SS] for longer videos.
    - Put the timestamp at the END of each bullet point.
    - Provide EXACTLY ONE timestamp per line. Never include more than one timestamp in any line.
    - Do NOT include timestamps in headings.

    Example format:
    ### Overview
    * This is a point about the video [12:34]
    * Another important point from a different part [15:20]

    Available Context:
    ${relevantChunks}

    User Question: ${query}
    `;
}
export function classifierSystemPrompt(query: string) {
  return `You are an intent classifier. Given a user's query about a YouTube video, return a JSON object with fields:
   - "intent": one of "FULL" or "RAG"
   - "confidence": number 0.0-1.0

   Return EXACTLY the JSON object and nothing else. Do NOT wrap it in Markdown code fences.

   Examples:
   Q: "Summarize the whole video and list the main takeaways."
   A: {"intent":"FULL","reason":"User explicitly asks to summarize the whole video","confidence":0.99}

   Q: "What timestamp does she mention the experimental setup?"
   A: {"intent":"RAG","reason":"User asks for a specific timestamp/quote","confidence":0.98}

   Q: "Give me a high-level summary and also find the parts where they mention 'climate change'."
   A: {"intent":"HYBRID","reason":"User requests both global summary and targeted retrieval","confidence":0.95}

   Now classify:
   Q: "${query}"
   `;
}

export function generateChunkText(text: string, chunkSize: number) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}
