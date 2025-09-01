const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const recommendationController = require('../controllers/recommendationController');

router.get('/:fieldId', auth, recommendationController.getRecommendation);

module.exports = router;
