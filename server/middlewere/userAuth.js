import jwt from 'jsonwebtoken'

export const AuthUser = (req, res, next) => {
    try {
        // Get token from Authorization header (Bearer token format)
        const authHeader = req.headers.authorization
        const token = authHeader && authHeader.startsWith('Bearer ') 
            ? authHeader.substring(7) 
            : req.headers.token // Fallback to direct token header

        if (!token) {
            return res.status(401).json({
                success: false,
                error: "Access denied. No token provided."
            })
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.id || decoded._id
        req.user = decoded
        next()

    } catch (error) {
        console.error('Auth middleware error:', error.message)
        return res.status(401).json({
            success: false,
            error: "Invalid token"
        })
    }
}