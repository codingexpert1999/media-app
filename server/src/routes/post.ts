import {Router} from 'express';
import { fetch, create, update, remove, like, unlike, getAllLikes } from '../controllers/post';
import {loginRequired, isAuthenticated, userById, profileById} from '../middlewares/user'
import {postById} from '../middlewares/post'

const router = Router();

router.get("/posts/:userId/:profileId", loginRequired, isAuthenticated, fetch);

router.post("/posts/:userId/:profileId", loginRequired, isAuthenticated, create);

router.put("/posts/:postId/:userId/:profileId", loginRequired, isAuthenticated, update);

router.delete("/posts/:postId/:userId/:profileId", loginRequired, isAuthenticated, remove);

router.put("/posts/:postId/like/:userId/:profileId", loginRequired, isAuthenticated, like);
router.put("/posts/:postId/unlike/:userId/:profileId", loginRequired, isAuthenticated, unlike);

router.get("/posts/get_all_likes/:userId/:profileId", loginRequired, isAuthenticated, getAllLikes);

router.param("userId", userById);
router.param("profileId", profileById);
router.param("postId", postById);

export default router;