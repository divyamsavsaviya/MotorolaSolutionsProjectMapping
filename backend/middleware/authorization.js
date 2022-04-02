const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    //Bearer=>0 token=>1
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) res.status(401).json({ error: "Null Token" });
    // payload from token => employee
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, employee) => {
        if (error) res.status(403).json({ error: error.message });
        req.employee = employee;
        next();
    })
}

module.exports = {authenticateToken};