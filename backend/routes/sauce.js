const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauce');
const multer =  require('../middleware/multer-config');
const auth = require('../middleware/auth');
const input_validation = require('../middleware/input_validation');

router.post('/sauces' , auth , multer , input_validation ,  sauceCtrl.createSauce);
router.get('/sauces' , auth ,  sauceCtrl.getAllSauces);
router.get('/sauces/:id' , auth ,  multer , sauceCtrl.getOneSauce);
router.put('/sauces/:id' , auth  , multer , input_validation , sauceCtrl.modifySauce );
router.delete('/sauces/:id' , auth ,  multer , sauceCtrl.deleteSauce);
router.post('/sauces/:id/like' , auth , sauceCtrl.like_dislikeSauce)

module.exports = router;