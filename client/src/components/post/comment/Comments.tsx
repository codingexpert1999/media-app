import React from 'react'
import { Comment as CommentObj } from '../../../interfaces/post'
import Comment from './Comment'

const Comments = (props: {comments: CommentObj[], post_index:number}) => {
    return (
        <div className="comments">
            {props.comments.map((comment, index) => <Comment key={comment.id} comment={comment} post_index={props.post_index} comment_index={index}/>)}
        </div>
    )
}

export default Comments
