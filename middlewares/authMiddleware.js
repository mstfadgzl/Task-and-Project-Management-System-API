const jwt = require('jsonwebtoken');

exports.verifyToken = function (req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ error: "Erişim reddedildi. Token yok!" });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Token formatı hatalı!" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: "Geçersiz veya süresi dolmuş token!" });
    }
};

exports.isAdmin = function(req,res,next){
   if (req.user.role !== 'Admin') {
        return res.status(403).json({ error: "Bu işlemi sadece Adminler yapabilir!" });
    }
    next(); 
};