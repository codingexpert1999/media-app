import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '../../actions/layoutActions';
import { createPost } from '../../actions/postActions';
import { State } from '../../interfaces';

const CreatePost = () => {
    const [postText, setPostText] = useState("");

    const {user} = useSelector((state: State) => state.user)
    const {profile} = useSelector((state: State) => state.profile)

    const dispatch = useDispatch();

    const onSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        dispatch(createPost(user.id, profile.id, postText, "", ""))

        dispatch(closeModal())
    }

    return (
        <div className="modal create-post">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Create Post</h5>
                        <button type="button" className="btn-close" onClick={() => dispatch(closeModal())}></button>
                    </div>

                    <form onSubmit={onSubmit}>
                        <div className="modal-body">
                            <div className="form-group">
                                <textarea 
                                    className="form-control" 
                                    rows={6} 
                                    value={postText} 
                                    onChange={e => setPostText(e.target.value)}
                                    required
                                >
                                </textarea>
                            </div>

                            <div className="form-group">
                                <input type="file" className="form-control"/>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => dispatch(closeModal())}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={postText === ""}>Create +</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreatePost
