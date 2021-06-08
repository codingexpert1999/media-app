import {Router} from 'express';
import {isAuthorized, userById, profileById} from '../middlewares/user'
import {conversationById} from '../middlewares/messages'
import { getConversation, getConversationMessages, getConversations, readMessages } from '../controllers/messages';

const router = Router();

router.get("/conversation/:friendId/:userId/:profileId", isAuthorized, getConversation);

router.get("/conversation/:convoId/messages/:userId/:profileId", isAuthorized, getConversationMessages);

router.get("/conversations/:userId/:profileId", isAuthorized, getConversations);

router.put("/conversation/:convoId/mesages/read/:userId/:profileId", isAuthorized, readMessages)

router.param("userId", userById);
router.param("profileId", profileById);
router.param("convoId", conversationById);

export default router;