const express = require('express');

const router = express.Router({ mergeParams: true});

const Campground = require('../models/campground');
const Review = require('../models/review');

const reviews = require('../controllers/reviews');


const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

const { reviewSchema} = require('../schemas.js')

const { validateReview , isLoggedIn , isReviewAuthor}  = require ('../middleware');


//FOR CREATing REVIEWS
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

//FOR DELETING REVIEWS
router.delete('/:reviewId',isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));



module.exports = router;