const express = require('express');
const { getDoctors, getSpecialties } = require('../controllers/users');
const router = express.Router();

router.route('/doctors')
    .get(getDoctors);

router.route('/specialties')
    .get(getSpecialties);

module.exports = router;