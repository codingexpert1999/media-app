import {Router} from 'express';
import { create, update, remove, like, unlike } from '../controllers/comment';
import {isAuthorized, userById, profileById} from '../middlewares/user'
import {commentById} from '../middlewares/comment'
import {postById} from '../middlewares/post'
import {check} from 'express-validator'

const router = Router();

router.post("/comments/:postId/:userId/:profileId", isAuthorized, [
    check("commentText", "Comment is required").notEmpty()
], create);

router.put("/comments/:commentId/:userId/:profileId", isAuthorized, [
    check("commentText", "Comment is required").notEmpty()
],update);

router.delete("/comments/:commentId/:userId/:profileId", isAuthorized, remove);

router.put("/comments/:commentId/like/:userId/:profileId", isAuthorized, like);
router.put("/comments/:commentId/unlike/:userId/:profileId", isAuthorized, unlike);

router.param("userId", userById);
router.param("commentId", commentById);
router.param("postId", postById);
router.param("profileId", profileById);

export default router;