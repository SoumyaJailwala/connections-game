import Board from "./components/Board"
import SolvedGroup from "./components/SolvedGroup"
import { useState } from "react"

export default function App() {
  const [selected, setSelected] = useState([])
  const [solvedGroups, setSolvedGroups] = useState([])


  const [groups, setGroups] = useState([])
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

    const allTiles = groups.flatMap(group => group.items)


  function toggleTile(tile) {
    if (selected.includes(tile)) {
      setSelected(selected.filter(t => t !== tile))
    } else {
        if (selected.length < 4) {
          const newSelected = [...selected, tile]
          setSelected(newSelected)
          setSolvedGroups([...solvedGroups])
        }
    }
  }

  function submitSelection() {
    if (selected.length === 4) {
      const match = groups.find(
      g =>
        !solvedGroups.includes(g.id) &&
        g.items.every(item => selected.includes(item))
    )
    if (match) {
      setSolvedGroups([...solvedGroups, match.id])
    }

    setSelected([])

    
    }
  }


  async function generateGroups() {
    if (!content.trim()) return
    setLoading(true)
    try {
      const res = await fetch("http://localhost:3001/api/generate-groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
      })
      const data = await res.json()
      const groupsWithIds = data.map((g, i) => ({ ...g, id: i }))
      setGroups(groupsWithIds)
      setSolvedGroups([])
      setSelected([])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-purple-100">
      <h1 className="text-3xl font-bold">Connections Game</h1>

      <textarea
        className="border p-2 w-full max-w-md mb-2"
        rows={5}
        placeholder="Paste study material here..."
        value={content}
        onChange={e => setContent(e.target.value)}
      />

      <button
        onClick={generateGroups}
        disabled={loading}
        className="mb-4 px-6 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-900 transition"
      >
        {loading ? "Generating..." : "Generate Game"}
      </button>

      <div>

        {groups.filter(g => solvedGroups.includes(g.id)).map(g => (
          <SolvedGroup key={g.id} group={g} />
        ))}


      </div>
      <Board tiles={allTiles}
        selected={selected}
        solvedGroups={solvedGroups}
        onTileClick={toggleTile} />
      <button
        onClick={submitSelection}
        className="mb-6 px-6 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-900 transition"
      >
        Submit Selection
      </button>
    </div>
  )
}