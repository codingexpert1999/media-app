import React, {useState} from 'react'
import Answers from '../answer/Answers'

const Comment = () => {
    const [showAnswers, setShowAnswers] = useState(false);

    return (
        <div className="card-body comment">
            <div className="posted-by">
                <img src="/assets/user.png" className="img-fluid" alt="Default User"/> Jane Doe 
                <span className="time-posted">18 January 12:45</span>
            </div>

            <p className="card-text">
                Some quick example text to build on the card title and make up the bulk of the card's content.
            </p>

            <div className="post-icons">
                <span>
                    <span>
                        <i className="fas fa-thumbs-up"></i> Like
                    </span> 
                    <span className="badge bg-primary">23</span>
                </span>

                <span>
                    <span>
                        <i className="far fa-comments"></i> Answers
                    </span> 
                    <span className="badge bg-primary">3</span>
                </span>
            </div>

            {showAnswers && <Answers/>}

            <button 
                className="btn btn-outline-warning bg-white text-warning border border-warning show-answers" 
                onClick={() => setShowAnswers(!showAnswers)}
            >
                {!showAnswers ? "Show Answers +" : "Hide Answers -"}
            </button>
        </div>
    )
}

export default Comment
