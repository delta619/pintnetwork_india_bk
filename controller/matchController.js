const initiateMatch = require('../MatchAlgorithm/main');






exports.matchAllNow = async(req , res , next)=>{



    initiateMatch()
    .then((data)=>{
        res.status(200).json({
            status:"Success",
            data
        })
        
    })
    .catch(e=>{
        res.status(500).json({
            status:"Failed",
            message:e
        })
        
    })

    

   
}



