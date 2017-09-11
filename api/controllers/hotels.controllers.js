var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');


var runGeoQuery = function(req, res) {
    var lng = parseFloat(req.query.lng);
    var lat  = parseFloat(req.query.lat);

    if(isNaN(lat) || isNaN(lng)){
        res
            .status(400)
            .json({
                "message" : "If supplied lng and lat in querystring should be numbers"
            });
        return;
    }

    // creat a geo json object
    var point = {
        type : "Point",
        coordinates : [lng, lat]
    };
    var geoOptions = {
        spherical : true,
        maxDistance : 2000, // 2 kms
        num : 5 // number of results (pagination)
    };
    console.log("running geo locations");
    Hotel
        .geoNear(point, geoOptions, function(err, result, stats) {
            if(err) {
                res
                    .status(500)
                    .json(err);
            } else {
                console.log("geo location found " , result);
                console.log("geo location stats ", stats);
                res
                    .status(200)
                    .json(result);
            }
        });
};


module.exports.hotelsGetAll = function (req, res) {
    console.log('GET the hotels');
    console.log(req.query);
    
    var offset = 0;
    var count = 5;
    var maxCount = 10;

    if(req.query && req.query.lat && req.query.lng) {
        runGeoQuery(req, res);
        return;
    }

    if(req.query && req.query.offset) {
        offset = parseInt(req.query.offset, 10);
    }

    if(req.query && req.query.count) {
        count = parseInt(req.query.count, 10);
    }

    if(isNaN(count) || isNaN(offset)){
        res
            .status(400)
            .json({
                "message" : "If supplied offset and count in querystring should be numbers"
            });
        return;
    }

    if(count > maxCount) {
        res
            .status(400)
            .json({
                "message" : "count limit of " + maxCount + "exceeded"
            });
        return;
    }

    Hotel
        .find()
        .skip(offset)
        .limit(count)
        .exec(function(err, hotels){
            if(err) {
                res
                    .status(500)
                    .json(err);
            } else {
                console.log('found hotels ', hotels.length);
                res
                    .status(200)
                    .json(hotels);
            }
        });
};

module.exports.hotelsGetOne = function (req, res) {  
    var hotelId = req.params.hotelId;
    
    Hotel
        .findById(hotelId)
        .exec(function(err, doc){
            var response = {
                status : 200,
                message : doc
            };
            if(err) {
                response.status = 500;
                response.message = err;
            } else if(!doc) {
                response.status = 404;
                response.message = {
                    "message" : "this hotel id is not found"
                };
            }
            console.log(doc);
            res
                .status(response.status)
                .json(response.message);
        });
};

var _splitArray = function(input) {
    var output;
    if(input && input.length>0){
        output = input.split(';');
    } else {
        output = [];
    }
    return output;
};

module.exports.hotelsAddOne = function(req, res) {
    Hotel
        .create({
            name : req.body.name,
            description : req.body.description,
            stars : parseInt(req.body.stars, 10),
            services : _splitArray(req.body.services),
            photos : _splitArray(req.body.photos),
            currency : req.body.currency,
            location : {
                address : req.body.address,
                coordinates : [
                    parseFloat(req.body.lng), 
                    parseFloat(req.body.lat)
                ]
            }
        }, function(err, hotel) {
            if(err) {
                console.log("Error creating the hotel");
                res
                    .status(400)
                    .json(err);
            } else {
                console.log("hotel created ", hotel);
                res
                    .status(201)
                    .json(hotel);
            }
        });
};

// update a specific hotel
module.exports.hotelsUpdateOne = function(req, res) {
    var hotelId = req.params.hotelId;
    
    Hotel
        .findById(hotelId)
        .select("-reviews -rooms")
        .exec(function(err, doc){
            var response = {
                status : 200,
                message : doc
            };
            if(err) {
                response.status = 500;
                response.message = err;
            } else if(!doc) {
                response.status = 404;
                response.message = {
                    "message" : "this hotel id is not found"
                };
            }
            //step two
            if(response.status !== 200) {
                console.log(doc);
                res
                    .status(response.status)
                    .json(response.message);
            } else {
                doc.name = req.body.name;
                doc.description = req.body.description;
                doc.stars = parseInt(req.body.stars, 10);
                doc.services = _splitArray(req.body.services);
                doc.photos = _splitArray(req.body.photos);
                doc.currency = req.body.currency;
                doc.location = {
                    address : req.body.address,
                    coordinates : [
                        parseFloat(req.body.lng), 
                        parseFloat(req.body.lat)
                    ]
                };

                doc.save(function(err, hotelsUpdate) {
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

module.exports.hotelsDeleteOne = function (req, res) {
    var hotelId = req.params.hotelId;

    Hotel
        .findByIdAndRemove(hotelId)
        .exec(function(err, hotel) {
            if(err) {
                res
                    .status(500)
                    .json(err);
            } else {
                console.log("hotel deleted wth id ", hotelId);
                res
                    .status(204)
                    .json();
            }
        });
};