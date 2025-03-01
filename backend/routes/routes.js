import express from 'express';
import { recovery_email, reset, contact, report_problem } from '../controllers/emailControllers.js';
import { profileUpdate, CustomPlaces, getCustomPlaces, deleteCustomPlace, getPlaces, addCurrentTrip, patchExpenses, patchMembers, fetchExpenses, fetchMembers, fetchPastTrips, updateCompleteStatus, fetchCurrentTrip, getManageId, delMyTrips, fetchAllExpenses, getDateComplete, personal_details, changePswd } from '../controllers/userControllers.js';
import { signup, signIn, googleSignIn, googleSignUp } from '../controllers/authControllers.js';

const router = express.Router();

router.get('/places', getPlaces);
router.get('/customPlaces', getCustomPlaces);
router.get('/getmembers', fetchMembers);
router.get('/getexpenses', fetchExpenses);
router.get('/getPastTrips', fetchPastTrips);
router.get('/getCurrentPlaces', fetchCurrentTrip);
router.get('/getManageId', getManageId);
router.get('/getAllExpenses',fetchAllExpenses);
router.get('/getDateComplete',getDateComplete);

router.post('/send_recovery_email', recovery_email);
router.post('/reset', reset);
router.post('/contact', contact);
router.post('/report_problem', report_problem);
router.post('/customPlaces', CustomPlaces);
router.post('/currentTrip', addCurrentTrip);
router.post('/signup', signup);
router.post('/signIn', signIn);
router.post('/google-signIn', googleSignIn);
router.post('/google-signUp', googleSignUp);

router.put('/profile_update', profileUpdate);
router.put('/personal_details', personal_details);
router.put('/changePswd',changePswd);

router.patch('/patchExpenses', patchExpenses);
router.patch('/patchMembers', patchMembers);
router.patch('/updateStatus', updateCompleteStatus);

router.delete('/customPlaces', deleteCustomPlace);
router.delete('/delMyTrips',delMyTrips);

export default router;