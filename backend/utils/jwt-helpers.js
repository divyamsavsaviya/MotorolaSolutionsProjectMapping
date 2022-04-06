const jwt = require('jsonwebtoken');

//payload data => name , email
function jwtTokens({ email, name ,role }) {
    const employee = { email, name ,role };
    // TODO - reduce time of expiry for access token 
    const accessToken = jwt.sign(employee, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '50m' }); //common practice is to keep it around 15min
    const refreshToken = jwt.sign(employee, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '400m' });  //expires in 1m seconds
    return ({ accessToken, refreshToken });
}

module.exports = { jwtTokens };