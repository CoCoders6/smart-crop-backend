const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const fieldController = require('../controllers/fieldController');

router.post('/', auth, fieldController.createField);
router.get('/', auth, fieldController.getFields);
router.get('/:id', auth, fieldController.getFieldById);

module.exports = router;
