import express from 'express';
import { recovery_email, reset, contact, report_problem } from '../controllers/emailControllers.js';
import { profileUpdate } from '../controllers/userControllers.js';
import { signup, signIn, googleSignIn, googleSignUp } from '../controllers/authControllers.js';

const router = express.Router();

// Email routes
router.post('/send_recovery_email', recovery_email);
router.post('/reset', reset);
router.post('/contact', contact);
router.post('/report_problem', report_problem);

// User routes
router.post('/profile_update', profileUpdate);

// Auth routes
router.post('/signup', signup);
router.post('/signIn', signIn);
router.post('/google-signIn', googleSignIn);
router.post('/google-signUp', googleSignUp);

export default router;