const mongoose = require("mongoose");

// const User = require('./userModel');

const tourSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        trim:true,
        required:[true,"A tour must have a name"]
    },
    duration:{
        type:Number,
        required:[true , "A tour must have a duration"]
    },
    maxGroupSize:{
        type:Number,
        required:[true, "A tour must have a group size"]
    },
    difficulty:{
        type: String,
        required:[true, "A tour must have a difficulty"]
    },
    ratingsAverage:{
        type:Number,
        default:4.5,
        set: val=> Math.round(val*10)/10
        
    },
    ratingsQuantity:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        required:[true,"A tour must have a price"]
    },
    priceDiscount:{
        type:Number,
        validate:{
            validator: function(val){
                return val < this.price;
            },
            message:"discount ({VALUE}) should be less than price"
        }
    },
    summary:{
        type:String,
        trim:true,
        required:[true , "A tour must have a description"]
    },
    description:{
        type:String,
        trim:true
    },
    imageCover:{
        type:String,
        require:[true , "A tour must a cover image"]
    },
    images:[String],
    createdAt:{
        type: Date,
        default:Date.now(),
        select:false
    },
    startDates:[Date],
    secretTour:{
        type: Boolean,
        default:false
    },
    startLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations:[
        {
            type:{
                type: String,
                default: 'Point',
                enum: ['Point'],
            },
            coordinates:[Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
        
    ]
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}

});


tourSchema.virtual('reviews',{
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
})


// tourSchema.pre('save', async function(next){

//     const guidesPromise = this.guides.map(async (id) => await User.findById(id));
//     this.guides = await Promise.all(guidesPromise);

//     next();
// })

tourSchema.pre(/^find/ , function(next){
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt',
    })
    next();
})


tourSchema.virtual('durationWeeks').get(function(){

    return this.duration/7;
})

tourSchema.index({startLocation: '2dsphere'})

const Tour = mongoose.model('tours',tourSchema);

module.exports = Tour;