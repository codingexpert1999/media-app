import {Router} from 'express';
import { fetch, create, update, remove, like, unlike } from '../controllers/answer';
import {loginRequired, isAuthenticated, userById} from '../middlewares/user'
import {answerById} from '../middlewares/answer'
import {commentById} from '../middlewares/comment'
import {check} from 'express-validator'

const router = Router();

router.get("/answers/:commentId/:userId", loginRequired, isAuthenticated, fetch);

router.post("/answers/:commentId/:userId", loginRequired, isAuthenticated, [
    check("answerText", "Answer is required").notEmpty()
], create);

router.put("/answers/:answerId/:userId", loginRequired, isAuthenticated, [
    check("answerText", "Answer is required").notEmpty()
], update);

router.delete("/answers/:answerId/:userId", loginRequired, isAuthenticated, remove);

router.put("/answers/:answerId/like/:userId", loginRequired, isAuthenticated, like);
router.put("/answers/:answerId/unlike/:userId", loginRequired, isAuthenticated, unlike);

router.param("userId", userById);
router.param("answerId", answerById);
router.param("commentId", commentById);

export default router;