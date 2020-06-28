const mongoose = require('mongoose');
const Tour = require("./tourModel");
const reviewSchema = mongoose.Schema({
  
    review:{
        type: String,
        required: [true, 'Review cannot be empty']
    },
    rating: {
        type: Number,
        min:1,
        max:5,
        required:[true, 'Rating is required']
    },
    createdAt: {
        type: Date,
        default:Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        required: [true, 'Userid must be specified for the review'],
        ref: 'User'
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        required: [true, "Tourid must be specified for the review."],
        ref: 'tours'
    }
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

reviewSchema.statics.calcAverageRatings =async function(tourId){

    const stats = await this.aggregate([
        {
            $match:{
                tour:tourId
            }
        },
        {
            $group:{
                _id:'$tour',
                nRating: {$sum: 1},
                avgRating: {$avg: '$rating'}

            }
        }
    ])
    if(stats.length> 0 ){
        
        await Tour.findByIdAndUpdate(tourId,{
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        })
    }else{
        await Tour.findByIdAndUpdate(tourId,{
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        })
    }
}



reviewSchema.post('save',async function(){
    
    this.constructor.calcAverageRatings(this.tour);

})


reviewSchema.pre(/^findOneAnd/, async function(next){


    const r = await this.findOne();
    

    this.tour = r;
    

    
    // this
    // .populate({
    //     path: 'user',
    //     select: 'name'
    // })
    // .populate({
    //     path: 'tour',
    //     select: 'name'
    //     // select: 'name'
    // })
    next()
})



reviewSchema.post(/^findOneAnd/,async function(){
    
    if(this.tour)
    await this.tour.constructor.calcAverageRatings(this.tour.tour)

});

reviewSchema.index({tour: 1, user: 1},{unique:true})

const Reviews = mongoose.model('Review', reviewSchema);

module.exports = Reviews;