import React from 'react'
import { Answer as AnswerObj } from '../../../interfaces/post'
import Answer from './Answer'

const Answers = (props: {answers: AnswerObj[], post_index: number, comment_index: number}) => {
    return (
        <div className="answers">
            {props.answers.map(answer => <Answer key={answer.id} answer={answer} post_index={props.post_index} comment_index={props.comment_index} />)}
        </div>
    )
}

export default Answers
