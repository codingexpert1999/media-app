import {Router} from 'express';
import {login, signup} from '../controllers/auth';
import {check} from 'express-validator';

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

export default router;