// api/generate.js
import OpenAI from "openai";
const openai = new OpenAI();              // uses OPENAI_API_KEY at deploy time

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { story } = req.body;           // ✅ works on Vercel’s Node runtime;
  if (!story) return res.status(400).json({ error: "No story provided" });


  const messages = [
    { role: "system", content: `
You are an expert synthwave producer.
Return ONLY valid JSON with keys:
bpm, key, global_reasoning, layers, sections, chord_progression` },
    { role: "user", content: story }
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    response_format: { type: "json_object" }
  });

  res.setHeader("Content-Type", "application/json");
  res.send(completion.choices[0].message.content);
}