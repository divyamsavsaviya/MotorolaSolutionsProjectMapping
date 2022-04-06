const express = require('express');
const pool = require('../db.js');
const bcrypt = require('bcrypt');
const { authenticateToken } = require('../middleware/authorization.js')

const router = express.Router()

router.get('/', authenticateToken, async (req, res) => {
    try {
        employees = await pool.query('SELECT * FROM public.employees');
        res.json({ employees: employees.rows });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
})

router.post('/addEmployee', authenticateToken, async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newEmployee = await pool.query(
            'INSERT INTO public.employees (email, password, name) VALUES ($1,$2,$3) RETURNING *',
            [email, hashedPassword, name]);
        res.json({ employees: newEmployee.rows[0] });
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
})

router.post('/getEmployeeInformation', authenticateToken, async (req, res) => {
    try {
        employee = await pool.query('SELECT email, name, role FROM public.employees WHERE email=($1)',
            [req.body.email]);
            console.log(employee.rows[0]);
        res.json(employee.rows[0]);
    } catch (error) {
        res.send({ error: error.message });
    }
})

module.exports = router;