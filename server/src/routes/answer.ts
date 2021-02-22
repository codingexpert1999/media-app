import {Router} from 'express';
import { create, update, remove, like, unlike } from '../controllers/answer';
import {loginRequired, isAuthenticated, userById, profileById} from '../middlewares/user'
import {answerById} from '../middlewares/answer'
import {commentById} from '../middlewares/comment'
import {check} from 'express-validator'

const router = Router();

router.post("/answers/:commentId/:userId/:profileId", loginRequired, isAuthenticated, [
    check("answerText", "Answer is required").notEmpty()
], create);

router.put("/answers/:answerId/:userId/:profileId", loginRequired, isAuthenticated, [
    check("answerText", "Answer is required").notEmpty()
], update);

router.delete("/answers/:answerId/:userId/:profileId", loginRequired, isAuthenticated, remove);

router.put("/answers/:answerId/like/:userId/:profileId", loginRequired, isAuthenticated, like);
router.put("/answers/:answerId/unlike/:userId/:profileId", loginRequired, isAuthenticated, unlike);

router.param("userId", userById);
router.param("answerId", answerById);
router.param("commentId", commentById);
router.param("profileId", profileById);

export default router;