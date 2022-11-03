
const { campgroundSchema , reviewSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req,res, next) => {
    console.log("REQ,USER...", req.user);
    if(!req.isAuthenticated()) {
        
       req.session.returnTo = req.originalUrl
        //==========FLASH MESSAGE=======//
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
};


///============ FOR VALIDATING CAMPGROUND ===============//
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

///============ FOR VERIFYING THE AUTHER OF THE SUBMITTER CAMPGROUND  ===============//
module.exports.isAuthor = async(req,res, next) => {
    const { id } = req.params;
    const campground= await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!!');
       return res.redirect(`/campgrounds/${id}`)
    }
next();
}


///============ FOR VERIFYING THE AUTHER OF THE SUBMITTER CAMPGROUND  ===============//
module.exports.isReviewAuthor = async(req,res, next) => {
    const {id, reviewId}  = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!!');
       return res.redirect(`/campgrounds/${id}`)
    }
next();
}

//=================VALIDATING REVIEWS======///
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
