
//Error is the parent class of the js, and we make child class ErrorHanderler, which defines extra error-functionality(statuscode,success, etc) of error, which is make by us.
class ErrorHandler extends Error{
    constructor (statusCode, message='code fatt gaya',errors=[],stack){
        //we use super because we have to run the parent class(Error), without its only Errorhandler will run
        super(message); //call the parent first
        this.statusCode = statusCode;
        this.stack = stack;
        this.errors = errors;
        this.message = message;
        this.success = false;
    }   
}

export default ErrorHandler;