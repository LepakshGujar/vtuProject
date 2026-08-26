import AppError from "../utils/appError.js";

const errorMiddleware = (
    err,
    req,
    res,
    next
) => {

    console.error(
        "❌ Error:",
        err.message
    );

    let error = {
        ...err,
        message: err.message
    };


    // ==========================
    // Custom AppError
    // ==========================

    if (err.isOperational) {

        return res
            .status(err.statusCode)
            .json({

                success: false,

                message: err.message

            });

    }


    // ==========================
    // Invalid MongoDB ID
    // ==========================

    if (err.name === "CastError") {

        error = new AppError(
            `Invalid ${err.path}: ${err.value}`,
            400
        );

    }


    // ==========================
    // Duplicate MongoDB Field
    // ==========================

    if (err.code === 11000) {

        const field =
            Object.keys(
                err.keyValue
            )[0];

        error = new AppError(
            `${field} already exists.`,
            400
        );

    }


    // ==========================
    // Mongoose Validation Error
    // ==========================

    if (
        err.name ===
        "ValidationError"
    ) {

        const messages =
            Object.values(
                err.errors
            ).map(
                item =>
                    item.message
            );

        error = new AppError(
            messages.join(", "),
            400
        );

    }


    // ==========================
    // JWT Invalid Token
    // ==========================

    if (
        err.name ===
        "JsonWebTokenError"
    ) {

        error = new AppError(
            "Invalid authentication token.",
            401
        );

    }


    // ==========================
    // JWT Expired Token
    // ==========================

    if (
        err.name ===
        "TokenExpiredError"
    ) {

        error = new AppError(
            "Authentication token has expired.",
            401
        );

    }


    // ==========================
    // Final Error Response
    // ==========================

    res
        .status(
            error.statusCode || 500
        )
        .json({

            success: false,

            message:
                error.message ||
                "Internal Server Error"

        });

};

export default errorMiddleware;