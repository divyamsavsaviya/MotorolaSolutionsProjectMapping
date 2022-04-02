const jwt = require('jsonwebtoken');

//payload data => name , email
function jwtTokens({name,email}) {
    const employee = {name,email};
    const accessToken = jwt.sign(employee,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'20s'}); //expires in 20 seconds
    const refreshToken = jwt.sign(employee,process.env.REFRESH_TOKEN_SECRET,{expiresIn:'1m'});  //expires in 1m seconds
    return ({accessToken,refreshToken});
}

module.exports ={jwtTokens};