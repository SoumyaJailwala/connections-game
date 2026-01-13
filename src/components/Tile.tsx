export default function Tile({word, selected, onClick}: {word: string; selected: boolean; onClick: () => void}) {
   return (
    <button
      onClick={onClick}
      className={`w-32 h-16
  flex items-center justify-center
  rounded-lg border
  text-sm font-semibold
  transition-all ${selected ? "bg-indigo-200 border-indigo-500" : "bg-white border-gray-300"}`}
    >
      {word}
    </button>
  );
}