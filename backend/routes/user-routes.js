const express = require('express');
const pool = require('../db.js');
const bcrypt = require('bcrypt');
const { authenticateToken } = require('../middleware/authorization.js')

const router = express.Router()

// Add employee
router.post('/', async (req, res) => {
    try {
        const { email, password, name, role, id } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newEmployee = await pool.query(
            'INSERT INTO public.users (email, password, name , role,id) VALUES ($1,$2,$3,$4,$5) RETURNING *',
            [email, hashedPassword, name, role, id]);
        res.json({ employees: newEmployee.rows[0] });
    } catch (error) {
        if (error.constraint === 'employees_pkey') {
            res.status(401).send({ error: "User already exists!", errorType: 'user_exists' });
            console.log(error.message);
        } else {
            res.status(401).send({ error: error.message });
        }
    }
})

// get employees list
router.get('/', async (req, res) => {
    try {
        employees = await pool.query('SELECT id, email, name, role FROM public.users;');
        if (employees.rows.length === 0) return res.json({ message: 'No users Found' });
        res.json({ employees: employees.rows });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
})


// return employee information
router.get('/getEmployeeInformation', authenticateToken, async (req, res) => {
    try {
        const { id } = req.body;
        const employee = await pool.query('SELECT email, name, role FROM public.users WHERE id=($1)',
            [id]);
        if (employee.rows.length === 1) {
            return res.json(employee.rows[0]);
        } else {
            res.status(400).json({ message: "User Not exists!" });
        }
    } catch (error) {
        res.send({ error: error.message });
    }
})

// updates employee email
router.put('/updateEmail', authenticateToken, async (req, res) => {
    const { email, id } = req.body;
    try {
        await pool.query('UPDATE public.users SET email=($1) WHERE id=($2);',
            [email, id]);
    } catch (error) {
        if (error.constraint === 'employees_pkey') {
            res.status(401).send({ error: "User exists with email " + email, errorType: 'invalid_email' });
        } else {
            res.status(401).send({ error: error.message });
        }
    }
})

// updates employee role
router.put('/updateRole', async (req, res) => {
    const { role, id } = req.body;
    try {
        employee = await pool.query('UPDATE public.users SET role=($1) WHERE id=($2);',
            [role, id]);
        res.json("Role Updated Successfully!");
    } catch (error) {
        res.send({ error: error.message });
    }
})

// update employee name
router.put('/updateName', authenticateToken, async (req, res) => {
    const { name, id } = req.body;
    try {
        employee = await pool.query('UPDATE public.users SET name=($1) WHERE id=($2);',
            [name, id]);
        res.json("Name Updated Successfully!");
    } catch (error) {
        res.send({ error: error.message });
    }
})

// removes employee
router.post('/removeEmployee', async (req, res) => {
    const { id } = req.body;
    try {
        await pool.query('DELETE FROM public.users WHERE id=$1;', [id]);
        res.json("Removed Employee Successfully!");
    } catch (error) {
        res.send({ error: error.message });
    }
})

module.exports = router;