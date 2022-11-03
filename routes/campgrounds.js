const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground');

const { campgroundSchema } = require('../schemas.js');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const multer  = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const campgrounds = require('../controllers/campgrounds')

router.route('/')
      .get( catchAsync(campgrounds.index))
             //TO ADD NEW CAMPGROUND

             .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));

 //TO ADD NEW CAMPGROUND (ONLT THE LOCALHOST)
router.get('/new',isLoggedIn ,campgrounds.renderNewForm);

router.route('/:id')
// SHOW PAGE:- FOR VIEWING A PARTICULAR CAMPGROUND . EX:- DUSTY POND
.get( catchAsync(campgrounds.showCampground))
//FOR UPDATING CAMPGROUND
.put( isLoggedIn ,isAuthor, upload.array('image'),  validateCampground, catchAsync(campgrounds.updatCampground))
//TO DELETE CAMPGROUND
.delete(isLoggedIn, isAuthor ,catchAsync(campgrounds.deleteCampground))




//TO EDIT CAMPGROUND
router.get('/:id/edit',isLoggedIn, isAuthor,catchAsync(campgrounds.renderEditForm));

module.exports = router;











