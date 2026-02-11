



     const restrictTo = (...roles) => {
       return (req, res, next) => {

    if (!req.user) {
         return res.status(500).json({ error: "User not attached to request" });
           }

          if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }

    next();
  };
  };

export default restrictTo;
