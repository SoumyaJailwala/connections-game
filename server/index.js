import express from "express"
import cors from "cors"
import OpenAI from "openai"

const app = express()
app.use(cors())
app.use(express.json())

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

app.post("/api/generate-groups", async (req, res) => {
  const { topic } = req.body

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You generate structured Connections puzzles."
        },
        {
          role: "user",
          content: `
Generate a Connections-style puzzle.

Rules:
- Exactly 4 groups
- Exactly 4 items per group
- No overlap
- Return ONLY JSON

Topic:
${topic}
          `
        }
      ],
      temperature: 0.7
    })

    const text = completion.choices[0].message.content
    const groups = JSON.parse(text)

    res.json(groups)
  } catch (err) {
    res.status(500).json({ error: "Failed to generate puzzle" })
  }
})

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001")
})
