import React, { useEffect, useState } from 'react'
import { Answer as AnswerObj } from '../../../interfaces/post'
import Moment from 'react-moment'
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../../../interfaces';
import { likeAnswer, removeAnswer, unlikeAnswer, updateAnswer } from '../../../actions/postActions';

const Answer = (props: {answer: AnswerObj, post_index: number, comment_index: number}) => {
    const dispatch = useDispatch();

    const {user, token} = useSelector((state: State) => state.user)
    const {profile} = useSelector((state: State) => state.profile)
    const {answersLiked, canClickLikeButton} = useSelector((state: State) => state.post)

    const [showOptions, setShowOptions] = useState(false);
    const [answerText, setAnswerText] = useState(props.answer.answer_text);
    const [edit, setEdit] = useState(false)
    const [isLiked, setIsLiked] = useState(false);
    
    useEffect(() => {
        setIsLiked(answersLiked.findIndex(a => a.answer_id === props.answer.id) !== -1 ? true : false)
    }, [answersLiked])

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let answer = {...props.answer};
        answer.answer_text = answerText;

        dispatch(updateAnswer(token, user.id, profile.id, answer, props.post_index, props.comment_index));

        setEdit(false);
    }

    return (
        <div className="card-body answer">
            {props.answer.profile_id === profile.id && <span className="options-button" onClick={() => setShowOptions(!showOptions)}>
                <i className="fas fa-ellipsis-h"></i>
            </span>}

            {showOptions && <ul className="options shadow card">
                <li onClick={() => {
                    setEdit(true);
                    setShowOptions(false);
                }}>Edit <i className="fas fa-edit"></i></li>
                <li onClick={() => {
                        dispatch(removeAnswer(token, user.id, profile.id, props.answer.id, props.post_index, props.comment_index))
                        setShowOptions(false);
                    }
                }>Delete <i className="fas fa-trash-alt"></i></li>
            </ul>}

            <div className="posted-by">
                <img src="/assets/user.png" className="img-fluid" alt="Default User"/> {props.answer.username} 
                <span className="time-posted"><Moment format="D MMMM YYYY hh:mm">{props.answer.created_at}</Moment></span>
            </div>

            {!edit && <p className="card-text">
                {props.answer.answer_text}
            </p>}

            {edit && 
                <form className="clearfix update-form" onSubmit={onSubmit}>
                    <div className="form-group">
                        <textarea
                            className="form-control"
                            rows={4}
                            value={answerText} 
                            onChange={e => setAnswerText(e.target.value)}
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
                                dispatch(likeAnswer(token, user.id, profile.id, props.answer.id, props.post_index, props.comment_index));
                                setIsLiked(true);
                            }else{
                                dispatch(unlikeAnswer(token, user.id, profile.id, props.answer.id, props.post_index, props.comment_index));
                                setIsLiked(false);
                            }
                        }}
                    >
                        <i className="fas fa-thumbs-up"></i> Like
                    </span> 
                    <span className="badge bg-primary">{props.answer.likes}</span>
                </span>
            </div>
        </div>
    )
}

export default Answer
