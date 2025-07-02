const errorResponse = (res, {statusCode =500, message='Internal Server Error.'})=>{
    res.status(statusCode).json({
        success: false,
        message
    })
}

const successResponse = (res, {statusCode, message='Succes', payload= {}})=>{
    res.status(statusCode).json({
        success: true,
        message,
        payload
    })
}

module.exports = {errorResponse, successResponse}