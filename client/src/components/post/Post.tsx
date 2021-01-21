import React, {useState} from 'react'
import Comments from './comment/Comments'

const Post = () => {
    const [showComments, setShowComments] = useState(false);

    return (
        <div className="card">
            <div className="card-body">
                <div className="posted-by">
                    <img src="/assets/user.png" className="img-fluid" alt="Default User"/> John Doe 
                    <span className="time-posted">17 January 12:32</span>
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
                            <i className="far fa-comments"></i> Comments
                        </span> 
                        <span className="badge bg-primary">3</span>
                    </span>
                </div>

            </div>

            {showComments && <Comments/>}

            <button 
                className="btn text-primary border border-primary show-comments" 
                onClick={() => setShowComments(!showComments)}
            >
                {!showComments ? "Show Comments +" : "Hide Comments -"}
            </button>
        </div>
    )
}

export default Post
