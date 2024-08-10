import { Search } from 'lucide-react'
import React,{forwardRef} from 'react'

function SearchSuggestions({children}) {
  return (
    <div>
        
    </div>
  )
}

const SearchItem = forwardRef(({
    itemText,
    searchText,
    className='flex flex-nowrap justify-start pt-1 pb-2 text-sm pl-3 pr-1 w-full hover:bg-gray-100 dark:hover:bg-gray-800',
    ...props
},ref)=>{
    let firstHalf,secondHalf,matchedIndex,matchedText
    matchedIndex = itemText.toLowerCase().indexOf(searchText.toLowerCase().trim())
    if (matchedIndex === -1) {
        if (searchText.includes(itemText)) {
            matchedText = itemText
            firstHalf = ''
            secondHalf = ''
        } else {
            firstHalf = itemText,
            secondHalf = ''
            matchedText = ''
        }
    } else {
        firstHalf = itemText.slice(0,matchedIndex)
        secondHalf = itemText.slice(matchedIndex + searchText.length,itemText.length)
        matchedText = searchText;
    }

return (
<button
ref={ref}
className={className}
{...props}
>
    <Search className="mr-2 mt-1 h-4 w-4" />
    <span>
        {firstHalf}
        <span className="font-bold">{matchedText}</span>
        {secondHalf}
    </span>
</button>
)
})

export {SearchSuggestions,SearchItem}


