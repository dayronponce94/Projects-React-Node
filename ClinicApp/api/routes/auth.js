const express = require('express');
const { check } = require('express-validator');
const {
    register,
    login,
    getMe,
    updateDetails,
    getUserById
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post(
    '/register',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
        check('role', 'Role is required').not().isEmpty()
    ],
    register
);

router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ],
    login
);

router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.get('/users/:id', getUserById);

module.exports = router;