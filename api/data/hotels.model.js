var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var reviewSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    rating : {
        type : Number,
        min : 0,
        max : 5,
        required : true
    },
    review : {
        type : String,
        required : true
    },
    createdOn : {
        type : Date,
        default : Date.now
    }
});

var roomSchema = new Schema({
    type : String,
    number : Number,
    description : String,
    photos : [String],
    price : Number
});

var hotelSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    stars : {
        type : Number,
        min : 0,
        max : 5,
        "default" : 0
    },
    services : [String],
    description : String,
    photos : [String],
    currency : String,
    reviews : [reviewSchema],
    rooms : [roomSchema],
    location : {
        address : String,
        // always store coordinates longitude, latitude order.
        coordinates : {
            type : [Number],
            index : "2dsphere"
        }
    }
});

module.exports = mongoose.model('Hotel', hotelSchema);