import {Router} from 'express';
import { 
    acceptFriendRequest, 
    sendFriendRequest, 
    fetch, 
    getNotifications, 
    getFriendRequests, 
    getFriends, 
    fetchCurrentProfile, 
    fetchProfilePosts, 
    updateProfileDescription, 
    findProfileUsernameMatches,
    getSearchResults,
    getSendedFriendRequests,
    cancelFriendRequest,
    removeFriend,
    readNotifications,
    deleteNotification,
    getNewNotifications
} from '../controllers/profile';
import {isAuthorized, userById, profileById} from '../middlewares/user'
import {check} from 'express-validator';

const router = Router();

router.get("/profile/:userId", isAuthorized, fetch);

router.get("/profile/notifications/:userId/:profileId", isAuthorized, getNotifications);
router.get("/profile/new_notifications/:userId/:profileId", isAuthorized, getNewNotifications);

router.get("/profile/friend_requests/:userId/:profileId", isAuthorized, getFriendRequests);

router.get("/profile/sended_friend_requests/:userId/:profileId", isAuthorized, getSendedFriendRequests);

router.get("/profile/friends/:userId/:profileId", isAuthorized, getFriends);

router.post("/profile/send_friend_request/:receiverProfileId/:userId/:profileId", sendFriendRequest);

router.post("/profile/accept_friend_request/:senderProfileId/:userId/:profileId", isAuthorized, acceptFriendRequest);

router.get("/profile/:currentProfile/:userId/:profileId", isAuthorized, fetchCurrentProfile);
router.get("/profile/:currentProfile/posts/:userId/:profileId", isAuthorized, fetchProfilePosts);

router.put("/profile/description/:userId/:profileId", isAuthorized,[
    check("description", "Description is required").notEmpty()
], updateProfileDescription);

router.post("/profile/search_profile/:userId/:profileId", isAuthorized, [
    check("firstLetter", "First letter of the username is required").notEmpty()
], findProfileUsernameMatches);

router.post("/profile/get_searching_results/:userId/:profileId", isAuthorized, [
    check("username", "Username is required").notEmpty()
], getSearchResults)

router.delete("/profile/friend_request/:receiverProfileId/:userId/:profileId", isAuthorized, cancelFriendRequest);

router.delete("/profile/friend/:friendshipId/:userId/:profileId", isAuthorized, removeFriend);

router.put("/profile/notifications/:userId/:profileId", isAuthorized, readNotifications);

router.delete("/profile/notifications/:notificationId/:userId/:profileId", isAuthorized, deleteNotification);

router.param("userId", userById);
router.param("profileId", profileById);

export default router;