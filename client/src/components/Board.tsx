import Tile from './Tile';

export default function Board({tiles, selected, onTileClick, solvedGroups, groups}: {tiles: string[]; selected: string[]; onTileClick: (index: string) => void, solvedGroups: number[], groups: {id: number; category: string; items: string[]}[]}) {
    return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
      {tiles.map(tile => {
        const isSolved = solvedGroups.some(groupId => {
          const group = groups.find(g => g.id === groupId)
          return group?.items.includes(tile)
        })

        if (isSolved) return null

        return (
          <Tile
            key={tile}
            word={tile}
            selected={selected.includes(tile)}
            onClick={() => onTileClick(tile)}
          />
        )
      })}
    </div>
  )
}