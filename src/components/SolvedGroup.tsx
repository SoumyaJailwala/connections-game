import {Group} from '../types/Group';
export default function SolvedGroup({group}: {group: Group}) {
    return (
    <div className='bg-purple-500 flex flex-col items-center justify-center text-white px-4 py-2 rounded-lg mb-4'>
      <strong>{group.category}</strong>
      <div> {group.items.join(", ")}</div>
    </div>
  )
}