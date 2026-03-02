
// Middleware to check if the user has the required role to access a resource
export const roleMiddleware = (req, res, next  ) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Only admin can access this resource' });
    }
    next();
};