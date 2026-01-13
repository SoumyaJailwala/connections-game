import express from "express"
import cors from "cors"
import OpenAI from "openai"
import dotenv from "dotenv"
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

app.post("/api/generate-groups", async (req, res) => {
  const { content } = req.body

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-5-nano-2025-08-07",
      messages: [
        {
          role: "system",
          content: "You generate structured Connections-style puzzles."
        },
        {
          role: "user",
          content: `
Generate a Connections-style puzzle. This is meant to be a study tools, so use the reference material to create groups that are relevant to the content and make sense.
Each group should have a short category name that describes the connection between the items.

Rules:
- Exactly 4 groups
- Exactly 4 items per group
- No overlap
- Return ONLY JSON

Groups are this format, so return the JSON accordingly:
export type Group = {
  id: number
  category: string
  items: string[]
}

Reference material:
${content}
          `
        }
      ],
      temperature: 1
    })

    const text = completion.choices[0].message.content
    console.log("LLM response:", text) 
    
    let groups
    try {
      groups = JSON.parse(text)
    } catch (err) {
      console.error("Failed to parse JSON:", err)
      console.error("Raw LLM output:", text)
      return res.status(500).json({ error: "Invalid JSON from AI", raw: text })
    }

    res.json(groups)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to generate groups" })
  }
})

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001")
})
