import React, {useEffect, useState} from 'react'
import { Comment as CommentObj } from '../../../interfaces/post';
import Answers from '../answer/Answers'
import Moment from 'react-moment';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../../../interfaces';
import { likeComment, removeComment, unlikeComment, updateComment } from '../../../actions/postActions';
import { openModal, setCommentIndex, setIdToUseInModal, setPostIndex } from '../../../actions/layoutActions';

const Comment = (props: {comment: CommentObj, post_index: number, comment_index: number}) => {
    const dispatch = useDispatch();

    const {user, token} = useSelector((state: State) => state.user)
    const {profile} = useSelector((state: State) => state.profile)
    const {commentsLiked, canClickLikeButton} = useSelector((state: State) => state.post)
    const {modalType} = useSelector((state: State) => state.layout)

    const [showOptions, setShowOptions] = useState(false);
    const [showAnswers, setShowAnswers] = useState(false);
    const [commentText, setCommentText] = useState(props.comment.comment_text);
    const [edit, setEdit] = useState(false)
    const [isLiked, setIsLiked] = useState(false);
    
    useEffect(() => {
        setIsLiked(commentsLiked.findIndex(c => c.comment_id === props.comment.id) !== -1 ? true : false)
    }, [commentsLiked])

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let comment = {...props.comment};
        comment.comment_text = commentText;

        dispatch(updateComment(token, user.id, profile.id, comment, props.post_index));

        setEdit(false);
    }

    return (
        <div className="card-body comment">
            {props.comment.profile_id === profile.id && <span className="options-button" onClick={() => setShowOptions(!showOptions)}>
                <i className="fas fa-ellipsis-h"></i>
            </span>}

            {showOptions && <ul className="options shadow card">
                <li onClick={() => {
                    setEdit(true);
                    setShowOptions(false);
                }}>Edit <i className="fas fa-edit"></i></li>
                <li onClick={() => {
                        dispatch(removeComment(token, user.id, profile.id, props.comment.id, props.post_index))
                        setShowOptions(false);
                    }
                }>Delete <i className="fas fa-trash-alt"></i></li>
            </ul>}

            <div className="posted-by">
                <img src="/assets/user.png" className="img-fluid" alt="Default User"/> {props.comment.username} 
                <span className="time-posted"><Moment format="D MMMM YYYY hh:mm">{props.comment.created_at}</Moment></span>
            </div>

            {!edit && <p className="card-text">
                {props.comment.comment_text}
            </p>}

            {edit && 
                <form className="clearfix update-form" onSubmit={onSubmit}>
                    <div className="form-group">
                        <textarea
                            className="form-control"
                            rows={4}
                            value={commentText} 
                            onChange={e => setCommentText(e.target.value)}
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
                                dispatch(likeComment(token, user.id, profile.id, props.comment.id, props.post_index));
                                setIsLiked(true);
                            }else{
                                dispatch(unlikeComment(token, user.id, profile.id, props.comment.id, props.post_index));
                                setIsLiked(false);
                            }
                        }}
                    >
                        <i className="fas fa-thumbs-up"></i> Like
                    </span> 
                    <span className="badge bg-primary">{props.comment.likes}</span>
                </span>

                <span>
                    <span onClick={() => {
                            if(modalType !== ""){
                                return;
                            }

                            dispatch(openModal("answer"))
                            dispatch(setIdToUseInModal(props.comment.id));
                            dispatch(setPostIndex(props.post_index));
                            dispatch(setCommentIndex(props.comment_index))
                        }}>
                        <i className="far fa-comments"></i> Answers
                    </span> 
                    <span className="badge bg-primary">{props.comment.answers.length}</span>
                </span>
            </div>

            {showAnswers && <Answers answers={props.comment.answers} comment_index={props.comment_index} post_index={props.post_index} />}

            {props.comment.answers.length > 0 && <button 
                className="btn btn-outline-warning bg-white text-warning border border-warning show-answers" 
                onClick={() => setShowAnswers(!showAnswers)}
            >
                {!showAnswers ? "Show Answers +" : "Hide Answers -"}
            </button>}
        </div>
    )
}

export default Comment
