import React from 'react'

const SearchProfile = (props: {setShowSearchProfile: Function}) => {
    return (
        <div className="search-profile-container">
            <form>
                <div className="input-group">
                    <input type="text" placeholder="Search profile..."/>
                    <i className="fas fa-search"></i>
                    <span onClick={() => props.setShowSearchProfile(false)}>&#x2715;</span>
                </div>
            </form>
        </div>
    )
}

export default SearchProfile
