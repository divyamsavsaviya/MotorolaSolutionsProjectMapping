const express = require('express')
const pool = require('../db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {jwtTokens} = require('../utils/jwt-helpers.js');
const { authenticateToken } = require('../middleware/authorization.js')

const router = express.Router();

router.post('/login' ,async (req, res) => {
    try {
        const {email, password} = req.body;
        const employees = await pool.query('SELECT * FROM public.employees WHERE email = $1',[email]);
        // check is Employee exists
        if(employees.rows.length === 0) return res.status(401).json({error : "Email is incorrect"});
        // validate password
        const validPassword = await bcrypt.compare(password , employees.rows[0].password); 
        if(!validPassword) return res.status(401).json({error : "Password is incorrect"});
        // JWT
        let tokens = jwtTokens(employees.rows[0]);
        res.cookie('refresh_token' , tokens.refreshToken,{httpOnly : true});
        res.json(tokens);
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
});

// using refresh token to get new access token & new refresh token
router.get('/refresh_token', (req, res) => {
    try {
        const refreshToken = req.cookies.refresh_token;
        if(refreshToken === null) return res.status(401).json({error : "Null refresh token"});
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET , (error , employee) => {
            if(error) return res.status(error).json({error : error.message});
            let tokens = jwtTokens(employee);
            res.cookie('refresh_token',tokens.refreshToken , {httpOnly : true});
            res.json(tokens);
        });
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
})

router.delete('/refresh_token',(req, res) => {
    try {
        res.clearCookie('refresh_token');
        return res.status(200).json({message : 'refresh token deleted'})
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
})

router.get('/decode_token',(req, res) => {
    try {
        const accessToken = req.cookies.accessToken;
        if(accessToken === null) return res.status(401).json({error : "Null access token"});
        const data = jwt.decode(accessToken);
        res.json(data);
    } catch (error) {
        res.status(401).send({ error: error.message });
    }

})

module.exports = router;