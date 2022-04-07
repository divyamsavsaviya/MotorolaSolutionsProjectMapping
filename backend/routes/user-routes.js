const express = require('express');
const pool = require('../db.js');
const bcrypt = require('bcrypt');
const { authenticateToken } = require('../middleware/authorization.js')

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        employees = await pool.query('SELECT id, email, name, role FROM public.users;');
        res.json({ employees: employees.rows });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
})

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { email, password, name, role, id } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newEmployee = await pool.query(
            'INSERT INTO public.users (email, password, name , role,id) VALUES ($1,$2,$3,$4,$5) RETURNING *',
            [email, hashedPassword, name, role, id]);
        res.json({ employees: newEmployee.rows[0] });
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
})

router.post('/getEmployeeInformation', authenticateToken, async (req, res) => {
    try {
        employee = await pool.query('SELECT email, name, role FROM public.users WHERE email=($1)',
            [req.body.email]);
        console.log(employee.rows[0]);
        res.json(employee.rows[0]);
    } catch (error) {
        res.send({ error: error.message });
    }
})

router.put('/', async (req, res) => {
    const { email, name, role, id } = req.body;
    try {
        employees = await pool.query(
            'UPDATE public.users SET email=($1), name=($2), role=($3), id=($4) WHERE email=$1'
            [email, password, name, role, id]);
        res.json({ employees: employees.rows });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
})




module.exports = router;