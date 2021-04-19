import React from 'react'
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { setCurrentProfileUsername } from '../../actions/profileActions';
import { SearchedProfile } from '../../interfaces/profile'
import RequestButton from './RequestButton';

const SearchResult = (props: {searchResult: SearchedProfile}) => {
    const history = useHistory();
    const dispatch = useDispatch();

    return (
        <div className="card d-flex flex-row align-items-center p-4 shadow">
            <div onClick={() => {
                    dispatch(setCurrentProfileUsername(props.searchResult.username));
                    history.push(`/profile/${props.searchResult.profile_id}`);
                }}>
                <img src={props.searchResult.profile_image} alt="User Default"/>
            </div>

            <div className="d-flex flex-column justify-content-center">
                <span onClick={() => {
                    dispatch(setCurrentProfileUsername(props.searchResult.username));
                    history.push(`/profile/${props.searchResult.profile_id}`);
                }}>{props.searchResult.username}</span>

                <RequestButton profileId={props.searchResult.profile_id} />
            </div>
        </div>
    )
}

export default SearchResult
