const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


router.post('/', auth, multer, saucesCtrl.createSauce);
router.get('/', auth, multer, saucesCtrl.getAllSauces);
router.get('/:id', auth, multer, saucesCtrl.getOneSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, multer, saucesCtrl.deleteSauce);

router.post('/:id/like', auth, multer, saucesCtrl.likeSauce);

module.exports = router;