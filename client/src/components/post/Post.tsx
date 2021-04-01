import React, {useEffect, useState} from 'react'
import { Post as PostObj } from '../../interfaces/post';
import {State} from '../../interfaces'
import Comments from './comment/Comments'
import Moment from 'react-moment'
import { useDispatch, useSelector } from 'react-redux';
import { likePost, removePost, unlikePost, updatePost } from '../../actions/postActions';
import { openModal, setIdToUseInModal, setPostIndex } from '../../actions/layoutActions';
import { useHistory } from 'react-router';
import { fetchCurrentProfile, setCurrentProfileUsername } from '../../actions/profileActions';

const Post = (props: {post: PostObj, post_index: number}) => {
    const dispatch = useDispatch();
    const history = useHistory()

    const {user} = useSelector((state: State) => state.user)
    const {profile} = useSelector((state: State) => state.profile)
    const {postsLiked, canClickLikeButton} = useSelector((state: State) => state.post)
    const {modalType} = useSelector((state: State) => state.layout)

    const [showComments, setShowComments] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [postText, setPostText] = useState(props.post.post_text);
    const [edit, setEdit] = useState(false)
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        setIsLiked(postsLiked.findIndex(p => p.post_id === props.post.id) !== -1 ? true : false)
    }, [postsLiked])

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let post = {...props.post};
        post.post_text = postText;

        dispatch(updatePost(user.id, profile.id, post));

        setEdit(false);
    }

    return (
        <div className="card">

            {props.post.profile_id === profile.id && <span className="options-button" onClick={() => setShowOptions(!showOptions)}>
                <i className="fas fa-ellipsis-h"></i>
            </span>}

            {showOptions && <ul className="options shadow card">
                <li onClick={() => {
                    setEdit(true);
                    setShowOptions(false);
                }}>Edit <i className="fas fa-edit"></i></li>
                <li onClick={() => {
                        dispatch(removePost(user.id, profile.id, props.post.id))
                        setShowOptions(false);
                    }
                }>Delete <i className="fas fa-trash-alt"></i></li>
            </ul>}

            <div className="card-body">
                <div className="posted-by">
                    <span className="post-user" onClick={() => {
                        dispatch(setCurrentProfileUsername(props.post.username))
                        history.push(`/profile/${props.post.profile_id}`)
                    }}>
                        <img src="/assets/user.png" className="img-fluid" alt="Default User"/> {props.post.username}
                    </span> 

                    <span className="time-posted"><Moment format="D MMMM YYYY hh:mm">{props.post.created_at}</Moment></span>
                </div>

                {!edit && <p className="card-text">
                    {props.post.post_text}
                </p>}

                {edit && 
                    <form className="clearfix update-form" onSubmit={onSubmit}>
                        <div className="form-group">
                            <textarea
                                className="form-control"
                                rows={4}
                                value={postText} 
                                onChange={e => setPostText(e.target.value)}
                                required
                            >
                            </textarea>

                            <div className="buttons float-end">
                                <button type="button" className="btn btn-secondary" onClick={() => setEdit(false)}>Cancel</button>

                                <button type="submit" className="btn btn-primary">Update</button>
                            </div>
                        </div>
                    </form>
                }

                <div className="post-icons">
                    <span>
                        <span 
                            style={isLiked ? {color: 'var(--bs-primary)'} : {}} 
                            onClick={() => {
                                if(!canClickLikeButton){
                                    return;
                                }

                                if(!isLiked){
                                    dispatch(likePost(user.id, profile.id, props.post.id));
                                    setIsLiked(true);
                                }else{
                                    dispatch(unlikePost(user.id, profile.id, props.post.id));
                                    setIsLiked(false);
                                }
                            }}
                        >
                            <i className="fas fa-thumbs-up"></i> Like
                        </span> 
                        <span className="badge bg-primary">{props.post.likes}</span>
                    </span>

                    <span>
                        <span onClick={() => {
                            if(modalType !== ""){
                                return;
                            }

                            dispatch(openModal("comment"))
                            dispatch(setIdToUseInModal(props.post.id));
                            dispatch(setPostIndex(props.post_index));
                        }}>
                            <i className="far fa-comments"></i> Comments
                        </span> 
                        <span className="badge bg-primary">{props.post.comments.length}</span>
                    </span>
                </div>

            </div>

            {showComments && <Comments comments={props.post.comments} post_index={props.post_index}/>}

            {props.post.comments.length > 0 && <button 
                className="btn text-primary border border-primary show-comments" 
                onClick={() => setShowComments(!showComments)}
            >
                {!showComments ? "Show Comments +" : "Hide Comments -"}
            </button>}
        </div>
    )
}

export default Post
