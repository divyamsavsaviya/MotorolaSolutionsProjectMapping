const jwt = require('jsonwebtoken');

//payload data => name , email
function jwtTokens({name,email}) {
    const employee = {name,email};
    // TODO - reduce time of expiry for access token 
    const accessToken = jwt.sign(employee,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'5'}); //common practice is to keep it around 15min
    const refreshToken = jwt.sign(employee,process.env.REFRESH_TOKEN_SECRET,{expiresIn:'1m'});  //expires in 1m seconds
    return ({accessToken,refreshToken});
}

module.exports ={jwtTokens};