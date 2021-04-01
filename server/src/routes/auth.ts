import {Router} from 'express';
import {login, logOut, signup, verifyUser} from '../controllers/auth';
import {check} from 'express-validator';
import { isAuthorized, profileById, userById } from '../middlewares/user';

const router = Router();

router.post("/login", [
    check("email", "Email is required").notEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Password is required").notEmpty()
], login);

router.post("/signup", [
    check("username", "Username is required").notEmpty(),
    check("email", "Email is required").notEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Password is required").notEmpty()
], signup);

router.get("/verify_user/:userId", verifyUser);

router.delete("/logout/:userId/:profileId", isAuthorized, logOut);

router.param("userId", userById);
router.param("profileId", profileById);

export default router;