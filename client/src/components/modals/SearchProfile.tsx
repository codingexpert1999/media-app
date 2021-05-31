import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../actions/layoutActions';
import { clearMatches, findUsernameMatches, getSearchingResults } from '../../actions/profileActions';
import { State } from '../../interfaces';

const SearchProfile = () => {
    const dispatch = useDispatch();

    const {user} = useSelector((state: State) => state.user);
    const {searchMatches, profile} = useSelector((state: State) => state.profile);

    const [searchedProfileUsername, setSearchedProfileUsername] = useState("");
    const [matches, setMatches] = useState([] as RegExpMatchArray[])

    const handleSearchChanged = (search=searchedProfileUsername) => {
        let regex = new RegExp(`^${search}`, 'i');

        let currentMatches = [] as RegExpMatchArray[];

        for(let i = 0; i < searchMatches.length; i++){
            let match = searchMatches[i].username.match(regex);
            if(match){
                currentMatches.push(match!)
            }
        }

        setMatches(currentMatches);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(searchedProfileUsername === ""){
            dispatch(findUsernameMatches(user.id, profile.id, e.target.value[0]));
        }

        if(searchedProfileUsername !== "" && e.target.value === ""){
            dispatch(clearMatches())
        }

        setSearchedProfileUsername(e.target.value)

        if(searchMatches.length !== 0){
            handleSearchChanged(e.target.value);
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        dispatch(getSearchingResults(user.id, profile.id, searchedProfileUsername));

        dispatch(closeModal());
    }

    useEffect(() => {
        handleSearchChanged();
    }, [searchMatches])

    return (
        <div className="search-profile-container">
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input 
                        type="text" 
                        placeholder="Search profile..." 
                        value={searchedProfileUsername}
                        onChange={handleChange}
                    />

                    <button type="submit">
                        <i className="fas fa-search"></i>
                    </button>

                    <span onClick={() => dispatch(closeModal())}>&#x2715;</span>

                    <ul className="autocomplete">
                        {
                            matches.map((match, i) => (
                                <li 
                                    key={i} 
                                    onClick={() => {
                                        setSearchedProfileUsername(searchedProfileUsername + match.input!.slice(searchedProfileUsername.length))
                                        setMatches([])
                                    }}
                                >
                                    {searchedProfileUsername}
                                    <span>{match.input!.slice(searchedProfileUsername.length)}</span>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </form>
        </div>
    )
}

export default SearchProfile
