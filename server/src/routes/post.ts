import {Router} from 'express';
import { fetch, create, update, remove, like, unlike } from '../controllers/post';
import {loginRequired, isAuthenticated, userById} from '../middlewares/user'
import {postById} from '../middlewares/post'

const router = Router();

router.get("/posts/:userId", loginRequired, isAuthenticated, fetch);

router.post("/posts/:userId", loginRequired, isAuthenticated, create);

router.put("/posts/:postId/:userId", loginRequired, isAuthenticated, update);

router.delete("/posts/:postId/:userId", loginRequired, isAuthenticated, remove);

router.put("/posts/:postId/like/:userId", loginRequired, isAuthenticated, like);
router.put("/posts/:postId/unlike/:userId", loginRequired, isAuthenticated, unlike);

router.param("userId", userById);
router.param("postId", postById);

export default router;