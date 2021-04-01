import { 
    CREATE_POST, 
    FETCH_POSTS, 
    LIKE_POST, 
    REMOVE_POST, 
    UNLIKE_POST, 
    UPDATE_POST, 
    CREATE_COMMENT, 
    UPDATE_COMMENT,
    REMOVE_COMMENT,
    LIKE_COMMENT,
    UNLIKE_COMMENT,
    CREATE_ANSWER,
    UPDATE_ANSWER,
    REMOVE_ANSWER,
    LIKE_ANSWER,
    UNLIKE_ANSWER,
    GET_ALL_LIKES,
    POSTS_LOADING,
    LIKE_BUTTON_CLICKED,
    CAN_CLICK_LIKE_BUTTON
} from "../actionTypes/postActionTypes";
import { FETCH_CURRENT_PROFILE_POSTS } from "../actionTypes/profileActionTypes";
import { LOG_OUT } from "../actionTypes/userActionTypes";
import { PostState, PostPayload } from "../interfaces/post";

const initialState: PostState = {
    posts: [],
    postsLiked: [],
    commentsLiked: [],
    answersLiked: [],
    canClickLikeButton: true,
    loading: false
};

const postReducer = (state= initialState, action: {type: string, payload: PostPayload}) => {
    const {type, payload} = action;

    let updatedPosts = state.posts;

    switch(type){
        case FETCH_POSTS:
            return {...state, posts: payload.posts, loading: false}
        case CREATE_POST:
            updatedPosts.unshift(payload.post)
            return {...state, posts: updatedPosts}
        case UPDATE_POST:
            updatedPosts = updatedPosts.map((post) => post.id === payload.post.id ? payload.post : post)
            return {...state, posts: updatedPosts}
        case REMOVE_POST:
            updatedPosts = updatedPosts.filter((post) => post.id !== payload.id)
            return {...state, posts: updatedPosts}
        case LIKE_POST:
            updatedPosts = updatedPosts.map((post) => {
                if(post.id === payload.id){
                    post.likes++;
                }

                return post;
            })

            return {...state, posts: updatedPosts}
        case UNLIKE_POST:
            updatedPosts = updatedPosts.map((post) => {
                if(post.id === payload.id){
                    post.likes--;
                }

                return post;
            })

            return {...state, posts: updatedPosts}
        case CREATE_COMMENT:
            updatedPosts[payload.post_index].comments.unshift(payload.comment);
            return {...state, posts: updatedPosts}
        case UPDATE_COMMENT:
            updatedPosts[payload.post_index].comments = 
                updatedPosts[payload.post_index].comments.map((comment) => comment.id === payload.comment.id ? payload.comment : comment)
            return {...state, posts: updatedPosts}
        case REMOVE_COMMENT:
            updatedPosts[payload.post_index].comments = 
                updatedPosts[payload.post_index].comments.filter((comment) => comment.id !== payload.id)
            return {...state, posts: updatedPosts}
        case LIKE_COMMENT:
            updatedPosts[payload.post_index].comments = 
                updatedPosts[payload.post_index].comments.map((comment) => {
                    if(comment.id === payload.id){
                        comment.likes++;
                    }

                    return comment
                })
            return {...state, posts: updatedPosts}
        case UNLIKE_COMMENT:
            updatedPosts[payload.post_index].comments = 
                updatedPosts[payload.post_index].comments.map((comment) => {
                    if(comment.id === payload.id){
                        comment.likes--;
                    }
                    
                    return comment
                })
            return {...state, posts: updatedPosts}
        case CREATE_ANSWER:
            updatedPosts[payload.post_index].comments[payload.comment_index].answers.unshift(payload.answer);
            return {...state, posts: updatedPosts}
        case UPDATE_ANSWER:
            updatedPosts[payload.post_index].comments[payload.comment_index].answers = 
                updatedPosts[payload.post_index]
                .comments[payload.comment_index]
                .answers.map((answer) => answer.id === payload.answer.id ? payload.answer : answer)
            return {...state, posts: updatedPosts}
        case REMOVE_ANSWER:
            updatedPosts[payload.post_index].comments[payload.comment_index].answers = 
                updatedPosts[payload.post_index]
                .comments[payload.comment_index]
                .answers.filter((answer) => answer.id !== payload.id)
            return {...state, posts: updatedPosts}
        case LIKE_ANSWER:
            updatedPosts[payload.post_index].comments[payload.comment_index].answers = 
                updatedPosts[payload.post_index]
                .comments[payload.comment_index]
                .answers.map((answer) => {
                    if(answer.id === payload.id){
                        answer.likes++;
                    }
                    return answer
                })
            return {...state, posts: updatedPosts}
        case UNLIKE_ANSWER:
            updatedPosts[payload.post_index].comments[payload.comment_index].answers = 
                updatedPosts[payload.post_index]
                .comments[payload.comment_index]
                .answers.map((answer) => {
                    if(answer.id === payload.id){
                        answer.likes--;
                    }
                    return answer
                })
            return {...state, posts: updatedPosts}
        case GET_ALL_LIKES:
            return {...state, postsLiked: payload.postsLiked, commentsLiked: payload.commentsLiked, answersLiked: payload.answersLiked}
        case POSTS_LOADING:
            return {...state, loading: true}
        case LIKE_BUTTON_CLICKED:
            return {...state, canClickLikeButton: false}
        case CAN_CLICK_LIKE_BUTTON:
            return {...state, canClickLikeButton: true}
        case FETCH_CURRENT_PROFILE_POSTS:
            return {...state, posts: payload.posts, loading: false}
        case LOG_OUT:
            return initialState;
        default:
            return state;
    }
}

export default postReducer;