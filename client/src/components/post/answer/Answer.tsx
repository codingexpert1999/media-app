import React from 'react'

const Answer = () => {
    return (
        <div className="card-body answer">
            <div className="posted-by">
                <img src="/assets/user.png" className="img-fluid" alt="Default User"/> John Doe 
                <span className="time-posted">18 January 12:58</span>
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
            </div>
        </div>
    )
}

export default Answer
