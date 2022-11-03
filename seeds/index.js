const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            //YOUR USER ID
            author: '633ef4e8db969c03b001e568',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                   url:'https://res.cloudinary.com/ddbtakrr5/image/upload/v1666267597/YelpCamp/vpw9ofeqeo7fqv0mcfhu.jpg',
                    // url: 'https://res.cloudinary.com/ddbtakrr5/image/upload/v1666266148/YelpCamp/alb3kwe2n6nk3m9zrtbu.jpg',
                    filename: 'YelpCamp/alb3kwe2n6nk3m9zrtbu'
                  },
                  {
                    
                    
                       
                        url: 'https://res.cloudinary.com/ddbtakrr5/image/upload/v1666267597/YelpCamp/vpw9ofeqeo7fqv0mcfhu.jpg',
                        filename: 'YelpCamp/vpw9ofeqeo7fqv0mcfhu'
                      
                  
                  }
                   
            ]
        })
        
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})