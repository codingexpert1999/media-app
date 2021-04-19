import React from 'react'
import { useSelector } from 'react-redux'
import { State } from '../../interfaces'
import SearchResult from './SearchResult'

const SearchedProfileResults = () => {
    const {searchResults} = useSelector((state: State) => state.profile);

    return (
        <div className="search-results">
            {
                searchResults.length > 0 ? 

                <>
                    <SearchResult searchResult={searchResults[0]}/>

                    <h2>Did you looking for any of these?</h2>

                    <hr/>

                    {searchResults.map((searchResult, i) => (
                        i !== 0 ? <SearchResult key={searchResult.profile_id} searchResult={searchResults[i]}/>
                        : null
                    ))}
                </>

                :

                <p>No results</p>
            }
        </div>
    )
}

export default SearchedProfileResults
