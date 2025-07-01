const errorHandler = (err, req, res, next) => {
    console.log("======================");
    console.log(err);
    console.log("======================");

    let code = 500
    let message = "Internal Server Error"

    if (err.message === "Gemini timeout.") {
        code = 503
        message = "Service Timeout"
    } else if (err.message === "INVALID_INPUT") {
        code = 400
        message = "Invalid input"
    } else if (err.message === "INVALID_CREDENTIAL") {
        code = 401
        message = "Invalid email or password"
    } else if (err.message === "UNAUTHORIZED") {
        code = 401
        message = "Unauthorized access"
    }

    res.status(code).json({ message })

}

module.exports = errorHandler