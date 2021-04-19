import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { acceptFriendRequest, cancelFriendRequest, removeFriend, sendFriendRequest } from '../../actions/profileActions';
import { State } from '../../interfaces';

const RequestButton = (props: {profileId: number}) => {
    const dispatch = useDispatch();

    const {user} = useSelector((state: State) => state.user);
    const {friends, friendRequests, sendedFriendRequests, canClickRequestButton, profile} = useSelector((state: State) => state.profile);

    let friend = friends.find(friend => friend.friend_profile_id === props.profileId);

    const [requestSended, setRequestSended] = 
        useState(sendedFriendRequests.find(request => request.receiver_profile_id === props.profileId) ? true : false);

    const [isFriend, setIsFriend] = useState(friend ? true : false)
    const [friendshipId, setFriendshipId] = useState(isFriend && friend ? friend.id : 0)
    const [hasRequestFromThisProfile, setHasRequestFromThisProfile] =
        useState(friendRequests.find(request => request.sender_profile_id === props.profileId) ? true : false)

    useEffect(() => {
        let friend = friends.find(friend => friend.friend_profile_id === props.profileId);
        setIsFriend(friend ? true : false)
        setFriendshipId(friend ? friend.id : 0)

        setHasRequestFromThisProfile(
            friend ? false : friendRequests.find(request => request.sender_profile_id === props.profileId) ? true : false
        );
    }, [friends])

    return (
        <button
            className={
                (isFriend || requestSended) ?
                "btn btn-danger" : 
                hasRequestFromThisProfile ? 
                "btn btn-success" :
                "btn btn-primary"
            }
            disabled={!canClickRequestButton}
            onClick={() => {
                if(!canClickRequestButton){
                    return;
                }

                if(isFriend){
                    dispatch(removeFriend(user.id, profile.id, friendshipId));
                }else{
                    if(hasRequestFromThisProfile){
                        dispatch(acceptFriendRequest(user.id, profile.id, props.profileId));
                    }else{
                        if(!requestSended){
                            dispatch(sendFriendRequest(user.id, profile.id, props.profileId))
                            setRequestSended(true);
                        }else{
                            dispatch(cancelFriendRequest(user.id, profile.id, props.profileId))
                            setRequestSended(false);
                        }
                    }
                }
            }}
        >
            {
                isFriend ? "Remove Friend" 
                : hasRequestFromThisProfile ?
                "Accept Friend Request" :
                requestSended ? "Cancel Friend Request" :
                "Send Friend Request"
            }
        </button>
    )
}

export default RequestButton
