import {Router} from 'express';
import { fetch, create, update, remove, like, unlike } from '../controllers/comment';
import {loginRequired, isAuthenticated, userById} from '../middlewares/user'
import {commentById} from '../middlewares/comment'
import {postById} from '../middlewares/post'
import {check} from 'express-validator'

const router = Router();

router.get("/comments/:postId/:userId", loginRequired, isAuthenticated, fetch);

router.post("/comments/:postId/:userId", loginRequired, isAuthenticated, [
    check("commentText", "Comment is required").notEmpty()
], create);

router.put("/comments/:commentId/:userId", loginRequired, isAuthenticated, [
    check("commentText", "Comment is required").notEmpty()
],update);

router.delete("/comments/:commentId/:userId", loginRequired, isAuthenticated, remove);

router.put("/comments/:commentId/like/:userId", loginRequired, isAuthenticated, like);
router.put("/comments/:commentId/unlike/:userId", loginRequired, isAuthenticated, unlike);

router.param("userId", userById);
router.param("commentId", commentById);
router.param("postId", postById);

export default router;