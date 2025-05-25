
const ErrorWrapper =  function (cb) {
    return async function (req,res,next) {
        
        try{
            // console.log('hii')
            await cb(req,res,next);
            // console.log('hii')
        }
        catch(err){
            console.error('❌ Error Caught in ErrorWrapper:', err); 
            res.status(err.statusCode).json({
                status: err.statusCode,
                message: err.message,
                success: false
            })
        }
    }
}

export default ErrorWrapper;