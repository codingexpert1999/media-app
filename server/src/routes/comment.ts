import {Router} from 'express';
import { create, update, remove, like, unlike } from '../controllers/comment';
import {loginRequired, isAuthenticated, userById, profileById} from '../middlewares/user'
import {commentById} from '../middlewares/comment'
import {postById} from '../middlewares/post'
import {check} from 'express-validator'

const router = Router();

router.post("/comments/:postId/:userId/:profileId", loginRequired, isAuthenticated, [
    check("commentText", "Comment is required").notEmpty()
], create);

router.put("/comments/:commentId/:userId/:profileId", loginRequired, isAuthenticated, [
    check("commentText", "Comment is required").notEmpty()
],update);

router.delete("/comments/:commentId/:userId/:profileId", loginRequired, isAuthenticated, remove);

router.put("/comments/:commentId/like/:userId/:profileId", loginRequired, isAuthenticated, like);
router.put("/comments/:commentId/unlike/:userId/:profileId", loginRequired, isAuthenticated, unlike);

router.param("userId", userById);
router.param("commentId", commentById);
router.param("postId", postById);
router.param("profileId", profileById);

export default router;