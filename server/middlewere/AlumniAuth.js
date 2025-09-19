import jwt from 'jsonwebtoken'

export const AuthAlumni = (req, res, next) => {
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
        
        // Check if user is alumni
        if (decoded.role !== 'alumni') {
            return res.status(403).json({
                success: false,
                error: "Access denied. Alumni privileges required."
            })
        }
        
        req.alumniId = decoded
        next()

    } catch (error) {
        console.error('Alumni auth middleware error:', error.message)
        return res.status(401).json({
            success: false,
            error: "Invalid token"
        })
    }
}