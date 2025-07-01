const errorHandler = (err, req, res, next) => {
    console.log("======================");
    console.log(err);
    console.log("======================");

    let code = 500
    let message = "Internal Server Error"

    res.status(code).json({ message })

}
