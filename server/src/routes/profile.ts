import {Router} from 'express';
import { acceptFriendRequest, sendFriendRequest, fetch, getNotifications, getFriendRequests, getFriends, fetchCurrentProfile, fetchProfilePosts, updateProfileDescription } from '../controllers/profile';
import {isAuthorized, userById, profileById} from '../middlewares/user'
import {check} from 'express-validator';

const router = Router();

router.get("/profile/:userId", isAuthorized, fetch);

router.get("/profile/notifications/:userId/:profileId", isAuthorized, getNotifications);

router.get("/profile/friend_requests/:userId/:profileId", isAuthorized, getFriendRequests);

router.get("/profile/friends/:userId/:profileId", isAuthorized, getFriends);

router.post("/profile/send_friend_request/:userId/:profileId", isAuthorized, [
    check('receiverProfileId', 'Profile ID of receiver required').notEmpty(),
    check('receiverProfileId', 'Profile ID of receiver must be intiger').isInt()
], sendFriendRequest);

router.post("/profile/accept_friend_request/:userId/:profileId", isAuthorized, [
    check('senderProfileId', 'Profile ID of sender required').notEmpty(),
    check('senderProfileId', 'Profile ID of sender must be intiger').isInt()
],acceptFriendRequest);

router.get("/profile/:currentProfile/:userId/:profileId", isAuthorized, fetchCurrentProfile);
router.get("/profile/:currentProfile/posts/:userId/:profileId", isAuthorized, fetchProfilePosts);

router.put("/profile/description/:userId/:profileId", isAuthorized, updateProfileDescription);

router.param("userId", userById);
router.param("profileId", profileById);

export default router;