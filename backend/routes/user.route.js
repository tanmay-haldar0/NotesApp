import express from 'express';
import { addUser, getUser, logIn } from '../controls/user.control.js';
import authenticationToken from "../utilities/util.js";

const router = express.Router();

router.post('/create-account', addUser);
router.post('/login', logIn);
router.get('/get-user', authenticationToken, getUser);

export default router;