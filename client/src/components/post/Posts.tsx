import React from 'react'
import { useSelector } from 'react-redux'
import { State } from '../../interfaces'
import Post from './Post'

const Posts = () => {
    const {posts} = useSelector((state:State) => state.post);

    const {loading} = useSelector((state: State) => state.post)

    return (
        <div className="posts">
            {posts.map((post, index) => <Post key={post.id} post={post} post_index={index} />)}

            {loading && 
                <div className="d-flex justify-content-center align-items-center loading">
                    <div className="spinner-border">
                    </div>
                    <span>Loading...</span>
                </div>
            }
        </div>
    )
}

export default Posts
