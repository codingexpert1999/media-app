export interface PostState{
    posts: Post[];
    postsLiked: PostLiked[];
    commentsLiked: CommentLiked[];
    answersLiked: AnswerLiked[];
    canClickLikeButton: boolean;
    loading: boolean;
}

export interface PostPayload{
    posts: Post[];
    id: number;
    post: Post;
    comment: Comment;
    answer: Answer;
    post_index: number;
    comment_index: number;
    postsLiked: PostLiked[];
    commentsLiked: CommentLiked[];
    answersLiked: AnswerLiked[];
}

export interface Post{
    id: number;
    post_text: string;
    post_video: string;
    post_image: string;
    likes: number;
    created_at: string;
    profile_id: number;
    username: string;
    comments: Comment[];
}

export interface Comment{
    id: number;
    comment_text: string;
    likes: number;
    created_at: string;
    profile_id: number;
    username: string;
    answers: Answer[];
}

export interface Answer{
    id: number;
    answer_text: string;
    likes: number;
    created_at: string;
    profile_id: number;
    username: string;
}

export interface PostLiked{
    id: number;
    post_id: number;
}

export interface CommentLiked{
    id: number;
    comment_id: number;
}

export interface AnswerLiked{
    id: number;
    answer_id: number;
}

