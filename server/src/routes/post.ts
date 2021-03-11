import {Router} from 'express';
import { fetch, create, update, remove, like, unlike, getAllLikes } from '../controllers/post';
import {isAuthorized, userById, profileById} from '../middlewares/user'
import {postById} from '../middlewares/post'

const router = Router();

router.get("/posts/:userId/:profileId", isAuthorized, fetch);

router.post("/posts/:userId/:profileId", isAuthorized, create);

router.put("/posts/:postId/:userId/:profileId", isAuthorized, update);

router.delete("/posts/:postId/:userId/:profileId", isAuthorized, remove);

router.put("/posts/:postId/like/:userId/:profileId", isAuthorized, like);
router.put("/posts/:postId/unlike/:userId/:profileId", isAuthorized, unlike);

router.get("/posts/get_all_likes/:userId/:profileId", isAuthorized, getAllLikes);

router.param("userId", userById);
router.param("profileId", profileById);
router.param("postId", postById);

export default router;