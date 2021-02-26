import {Dispatch} from "redux"
import {toast} from 'react-toastify'
import { getAxiosConfig, API, getAxiosBody } from "../helper"
import axios from "axios"
import { 
    CAN_CLICK_LIKE_BUTTON, 
    CREATE_ANSWER, 
    CREATE_COMMENT, 
    CREATE_POST, 
    FETCH_POSTS, 
    GET_ALL_LIKES, 
    LIKE_ANSWER, 
    LIKE_BUTTON_CLICKED, 
    LIKE_COMMENT, 
    LIKE_POST, 
    POSTS_LOADING, 
    REMOVE_ANSWER, 
    REMOVE_COMMENT, 
    REMOVE_POST, 
    UNLIKE_ANSWER, 
    UNLIKE_COMMENT, 
    UNLIKE_POST, 
    UPDATE_ANSWER, 
    UPDATE_COMMENT, 
    UPDATE_POST 
} from "../actionTypes/postActionTypes"
import { Post, Comment, Answer } from "../interfaces/post"

// Post Actions
export const fetchPosts = (token: string, userId: number, profileId: number) => {
    return async (dispatch:Dispatch) => {
        try {
            dispatch({type: POSTS_LOADING});

            const config = getAxiosConfig(token, false);

            const res = await axios.get(`${API}/posts/${userId}/${profileId}`, config);

            dispatch({type: FETCH_POSTS, payload: {posts: res.data}})
        } catch (err) {
            toast.error("Posts couldn't be fetched");
        }
    }
}

export const createPost = (token: string, userId: number, profileId: number, postText: string, postImage: string, postVideo: string) => {
    return async (dispatch:Dispatch) => {
        try {
            const config = getAxiosConfig(token);
            const body = getAxiosBody({postText, postImage, postVideo})

            const res = await axios.post(`${API}/posts/${userId}/${profileId}`, body, config);

            dispatch({type: CREATE_POST, payload: {post: res.data}})
        } catch (err) {
            toast.error("Post couldn't be created");
        }
    }
}

export const updatePost = (token: string, userId: number, profileId: number, post: Post) => {
    return async (dispatch:Dispatch) => {
        try {
            const config = getAxiosConfig(token);
            const body = getAxiosBody({postText: post.post_text, postImage: post.post_image, postVideo: post.post_video})

            await axios.put(`${API}/posts/${post.id}/${userId}/${profileId}`, body, config);

            dispatch({type: UPDATE_POST, payload: {post}})
        } catch (err) {
            toast.error("Post couldn't be updated");
        }
    }
}

export const removePost = (token: string, userId: number, profileId: number, postId: number) => {
    return async (dispatch:Dispatch) => {
        try {
            const config = getAxiosConfig(token, false);

            await axios.delete(`${API}/posts/${postId}/${userId}/${profileId}`, config);

            dispatch({type: REMOVE_POST, payload: {id: postId}})
        } catch (err) {
            toast.error("Post couldn't be removed");
        }
    }
}

export const likePost = (token: string, userId: number, profileId: number, postId: number) => {
    return async (dispatch:Dispatch) => {
        try {
            dispatch({type: LIKE_BUTTON_CLICKED});

            const config = getAxiosConfig(token, false);

            await axios.put(`${API}/posts/${postId}/like/${userId}/${profileId}`, null,  config);

            dispatch({type: LIKE_POST, payload: {id: postId}})
        } catch (err) {
            toast.error("Post couldn't be liked");
        }finally{
            dispatch({type: CAN_CLICK_LIKE_BUTTON});
        }
    }
}

export const unlikePost = (token: string, userId: number, profileId: number, postId: number) => {
    return async (dispatch:Dispatch) => {
        try {
            dispatch({type: LIKE_BUTTON_CLICKED});

            const config = getAxiosConfig(token, false);

            await axios.put(`${API}/posts/${postId}/unlike/${userId}/${profileId}`, null,  config);

            dispatch({type: UNLIKE_POST, payload: {id: postId}})
        } catch (err) {
            toast.error("Post couldn't be liked");
        }finally{
            dispatch({type: CAN_CLICK_LIKE_BUTTON});
        }
    }
}

export const getAllLikes = (token: string, userId: number, profileId: number) => {
    return async (dispatch:Dispatch) => {
        try {
            const config = getAxiosConfig(token, false);

            const res = await axios.get(`${API}/posts/get_all_likes/${userId}/${profileId}`, config);

            dispatch({type: GET_ALL_LIKES, payload: res.data})
        } catch (err) {
            toast.error("Likes couldn't be fetched");
        }
    }
}

// Comment Actions
export const createComment = (token: string, userId: number, profileId: number, commentText: string, postId: number, post_index: number) => {
    return async (dispatch:Dispatch) => {
        try {
            const config = getAxiosConfig(token);
            const body = getAxiosBody({commentText})

            const res = await axios.post(`${API}/comments/${postId}/${userId}/${profileId}`, body, config);

            dispatch({type: CREATE_COMMENT, payload: {comment: res.data, post_index}})
        } catch (err) {
            toast.error("Comment couldn't be created");
        }
    }
}

export const updateComment = (token: string, userId: number, profileId: number, comment: Comment, post_index: number) => {
    return async (dispatch:Dispatch) => {
        try {
            const config = getAxiosConfig(token);
            const body = getAxiosBody({commentText: comment.comment_text})

            await axios.put(`${API}/comments/${comment.id}/${userId}/${profileId}`, body, config);

            dispatch({type: UPDATE_COMMENT, payload: {comment, post_index}})
        } catch (err) {
            toast.error("Comment couldn't be updated");
        }
    }
}

export const removeComment = (token: string, userId: number, profileId: number, commentId: number, post_index: number) => {
    return async (dispatch:Dispatch) => {
        try {
            const config = getAxiosConfig(token, false);

            await axios.delete(`${API}/comments/${commentId}/${userId}/${profileId}`, config);

            dispatch({type: REMOVE_COMMENT, payload: {id: commentId, post_index}})
        } catch (err) {
            toast.error("Comment couldn't be removed");
        }
    }
}

export const likeComment = (token: string, userId: number, profileId: number, commentId: number, post_index: number) => {
    return async (dispatch:Dispatch) => {
        try {
            dispatch({type: LIKE_BUTTON_CLICKED});

            const config = getAxiosConfig(token, false);

            await axios.put(`${API}/comments/${commentId}/like/${userId}/${profileId}`, null,  config);

            dispatch({type: LIKE_COMMENT, payload: {id: commentId, post_index}})
        } catch (err) {
            toast.error("Comment couldn't be liked");
        }finally{
            dispatch({type: CAN_CLICK_LIKE_BUTTON});
        }
    }
}

export const unlikeComment = (token: string, userId: number, profileId: number, commentId: number, post_index: number) => {
    return async (dispatch:Dispatch) => {
        try {
            dispatch({type: LIKE_BUTTON_CLICKED});

            const config = getAxiosConfig(token, false);

            await axios.put(`${API}/comments/${commentId}/unlike/${userId}/${profileId}`, null,  config);

            dispatch({type: UNLIKE_COMMENT, payload: {id: commentId, post_index}})
        } catch (err) {
            toast.error("Comment couldn't be liked");
        }finally{
            dispatch({type: CAN_CLICK_LIKE_BUTTON});
        }
    }
}

// Answer Actions
export const createAnswer = 
(token: string, userId: number, profileId: number, answerText: string, commentId: number, post_index: number, comment_index: number) => {
    return async (dispatch:Dispatch) => {
        try {
            const config = getAxiosConfig(token);
            const body = getAxiosBody({answerText})

            const res = await axios.post(`${API}/answers/${commentId}/${userId}/${profileId}`, body, config);

            dispatch({type: CREATE_ANSWER, payload: {answer: res.data, post_index, comment_index}})
        } catch (err) {
            toast.error("Answer couldn't be created");
        }
    }
}

export const updateAnswer = 
(token: string, userId: number, profileId: number, answer: Answer, post_index: number, comment_index: number) => {
    return async (dispatch:Dispatch) => {
        try {
            const config = getAxiosConfig(token);
            const body = getAxiosBody({answerText: answer.answer_text})

            await axios.put(`${API}/answers/${answer.id}/${userId}/${profileId}`, body, config);

            dispatch({type: UPDATE_ANSWER, payload: {answer: answer, post_index, comment_index}})
        } catch (err) {
            toast.error("Answer couldn't be updated");
        }
    }
}

export const removeAnswer = 
(token: string, userId: number, profileId: number, answerId: number, post_index: number, comment_index: number) => {
    return async (dispatch:Dispatch) => {
        try {
            const config = getAxiosConfig(token, false);

            await axios.delete(`${API}/answers/${answerId}/${userId}/${profileId}`, config);

            dispatch({type: REMOVE_ANSWER, payload: {id: answerId, post_index, comment_index}})
        } catch (err) {
            toast.error("Comment couldn't be removed");
        }
    }
}

export const likeAnswer = 
(token: string, userId: number, profileId: number, answerId: number, post_index: number, comment_index: number) => {
    return async (dispatch:Dispatch) => {
        try {
            dispatch({type: LIKE_BUTTON_CLICKED});

            const config = getAxiosConfig(token, false);

            await axios.put(`${API}/answers/${answerId}/like/${userId}/${profileId}`, null,  config);

            dispatch({type: LIKE_ANSWER, payload: {id: answerId, post_index, comment_index}})
        } catch (err) {
            toast.error("Answer couldn't be liked");
        }finally{
            dispatch({type: CAN_CLICK_LIKE_BUTTON});
        }
    }
}

export const unlikeAnswer = 
(token: string, userId: number, profileId: number, answerId: number, post_index: number, comment_index: number) => {
    return async (dispatch:Dispatch) => {
        try {
            dispatch({type: LIKE_BUTTON_CLICKED});

            const config = getAxiosConfig(token, false);

            await axios.put(`${API}/answers/${answerId}/unlike/${userId}/${profileId}`, null,  config);

            dispatch({type: UNLIKE_ANSWER, payload: {id: answerId, post_index, comment_index}})
        } catch (err) {
            toast.error("Answer couldn't be liked");
        }finally{
            dispatch({type: CAN_CLICK_LIKE_BUTTON});
        }
    }
}