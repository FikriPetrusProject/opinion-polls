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
    } else if (err.message === "POLL_NOT_FOUND") {
        code = 404;
        message = "Poll not found";
    } else if (err.message === "OPTION_NOT_FOUND") {
        code = 404;
        message = "Invalid option for this poll";
    } else if (err.message === "ALREADY_VOTED") {
        code = 400;
        message = "You have already voted on this poll";
    }

    res.status(code).json({ message })
}

module.exports = errorHandler
