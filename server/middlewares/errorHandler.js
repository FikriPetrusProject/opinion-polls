const errorHandler = (err, req, res, next) => {
    console.log("======================");
    console.log(err);
    console.log("======================");

    let code = 500
    let message = "Internal Server Error"

    if(err.message === "Gemini timeout."){
        code = 503
        message = "Service Timeout"
    }

    res.status(code).json({ message })

}

module.exports = errorHandler