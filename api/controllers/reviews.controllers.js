var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

// get all reviews for a hotel
module.exports.reviewsGetAll = function(req, res) {
    var hotelId = req.params.hotelId;
    console.log('get reviews for hotel ' , hotelId);
    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec(function(err, doc){
            if(err) {
                res
                    .status(500)
                    .json(err);
            } else if(!doc) {
                res
                    .status(404)
                    .json({
                        "message" : "this hotel has no reviews"
                    });
            }else {
                console.log(doc);
                res
                    .status(200)
                    .json(doc.reviews);
            }
        });
};

// get a single review
module.exports.reviewsGetOne = function(req, res) {
    var hotelId = req.params.hotelId;
    var reviewId = req.params.reviewId;

    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec(function(err, hotel) {
            var review  = hotel.reviews.id(reviewId);
            var response = {
                status : 200,
                message : review 
            };
            if(err) {
                response.status = 500;
                response.message = err;
            } else if(!review) {
                response.status = 404;
                response.message = {
                    "message" : "review id isn't found"
                }
            }
            res
                .status(response.status)
                .json(response.message);
        });
};

// add new review

var _addReview = function(req, res, hotel) {
    hotel.reviews.push({
        name : req.body.name,
        rating : parseInt(req.body.rating, 10),
        review : req.body.review
    });

    hotel.save(function (err, hotelUpdated) {
        if(err) {
            res
                .status(500)
                .json(err);
        } else {
            res
                .status(201)
                .json(hotelUpdated.reviews[hotelUpdated.reviews.length-1]);
        }
    });
};

module.exports.reviewsAddOne = function (req, res) {
    var hotelId = req.params.hotelId;
    console.log('get reviews for hotel ' , hotelId);
    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec(function(err, doc) {
            var response = {
                status : 200,
                message : []
            };
            if(err) {
                response.status = 500;
                response.message = err;
            } else if(!doc) {
                response.status = 404;
                response.message = {
                    "message" : "hotel id not found "  + hotelId
                };
            }
            if(doc) {
                _addReview(req, res, doc);
            } else {
                res
                .status(response.status)
                .json(response.message);
            }
        });
};

// update a specific review
module.exports.reviewsUpdateOne = function(req, res) {
    var hotelId = req.params.hotelId;
    var reviewId = req.params.reviewId;

    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec(function(err, hotel) {
            var thisReview  = hotel.reviews.id(reviewId);
            var response = {
                status : 200,
                message : thisReview 
            };
            if(err) {
                response.status = 500;
                response.message = err;
            } else if(!thisReview) {
                response.status = 404;
                response.message = {
                    "message" : "review id isn't found"
                }
            }
            if(response.status !== 200) {
                res
                .status(response.status)
                .json(response.message);
            } else {
                thisReview.name = req.body.name;
                thisReview.review = req.body.review;
                thisReview.rating = parseInt(req.body.rating, 10);
                hotel.save(function(err, hotelUpdated) {
                    if(err) {
                        res
                            .status(500)
                            .json(err);
                    } else {
                        res
                            .status(204)
                            .json();
                    }
                });
            }
        });
};

module.exports.reviewsDeleteOne = function (req, res) {
    var hotelId = req.params.hotelId;
    var reviewId = req.params.reviewId;

    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec(function(err, hotel) {
            var thisReview  = hotel.reviews.id(reviewId);
            var response = {
                status : 200,
                message : thisReview 
            };
            if(err) {
                response.status = 500;
                response.message = err;
            } else if(!thisReview) {
                response.status = 404;
                response.message = {
                    "message" : "review id isn't found"
                }
            }
            if(response.status !== 200) {
                res
                    .status(response.status)
                    .json(response.message);
            } else {
                hotel.reviews.id(reviewId).remove();
                hotel.save(function(err, hotelUpdated) {
                    if(err) {
                        res
                            .status(500)
                            .json(err);
                    } else {
                        res
                            .status(204)
                            .json();
                    }
                });
            }
        });
};