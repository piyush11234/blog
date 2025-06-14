const jwt = require('jsonwebtoken');

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: 'User not authenticated',
                success: false
            });
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY);
        if (!decode) {
            return res.status(401).json({
                message: "Invalid token",
                success: false,
            })
        }

        req.id = decode.userId;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            message: 'Invalid or expired token',
            success: false
        });
    }
};

module.exports = { isAuth };
