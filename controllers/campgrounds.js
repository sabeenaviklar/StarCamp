const Campground = require('../models/campground');
 const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
 const mapBoxToken = process.env.MAPBOX_TOKEN
 const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");



module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
};


//TO ADD NEW CAMPGROUND ONLT THE LOCALHOST)
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};


//TO ADD NEW CAMPGROUND
module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
   
//     // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename })); //Cloudinary//
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully made the new campground!!')
    //above is flash message for sucessfully making something!!!
    res.redirect(`/campgrounds/${campground._id}`)


    
 }

// module.exports.createCampground = async (req, res, next) => {
//     const campground = new Campground(req.body.campground);
//     campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
//     campground.author = req.user._id;
//     await campground.save();
//     console.log(campground);
//     req.flash('success', 'Successfully made a new campground!');
//     res.redirect(`/campgrounds/${campground._id}`)
// }


// SHOW PAGE:- FOR VIEWING A PARTICULAR CAMPGROUND . EX:- DUSTY POND
module.exports.showCampground = async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate({
    path: 'reviews',
    populate: {
        path: 'author'
    }
}).populate({
   path:'author'
});
    console.log(campground);
    if(!campground){
        req.flash('error', 'Cannot find this Campground!! ')
        return   res.redirect('/campgrounds')
    }
    //console.log(campground)
    res.render('campgrounds/show', { campground });
}


//TO EDIT CAMPGROUND
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!!');
       return res.redirect(`/campgrounds/${id}`)
    }

    res.render('campgrounds/edit', { campground });
}


//FOR UPDATING CAMPGROUND
module.exports.updatCampground = async (req, res) => {
 
    const { id } = req.params;
    console.log(req.body);
   // const campground = await Campground.findById(id);
     const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
     const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
     campground.images.push(...imgs);
     await campground.save(); 
     if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
          await cloudinary.uploader.destroy(filename);
        }
     await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages }}}})
     console.log(campground);
     } 
     req.flash('success', 'Sucessfully updated campground')
     res.redirect(`/campgrounds/${campground._id}`)
       
}



//TO DELETE CAMPGROUND
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the campground')
    res.redirect('/campgrounds');
}