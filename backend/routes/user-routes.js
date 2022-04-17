const express = require('express');
const pool = require('../db.js');
const bcrypt = require('bcrypt');
const { authenticateToken } = require('../middleware/authorization.js');
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

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

// bulk import 


// bulk export [get]]
// users will export to backend/download/users.csv
router.get('/exportEmployees', async (req, res) => {
    try {
        const getProjectsQuery =
            "select * from users";
        const projects = await pool.query(getProjectsQuery);
        if (projects.rows.length === 0) return res.json({ message: 'No Users Found' });
        const jsonData = projects.rows;
        const csvWriter = createCsvWriter({
            path: "download/users.csv",

            header: [
                { id: "id", title: "id" },
                { id: "email", title: "email" },
                { id: "name", title: "name" },
                { id: "role", title: "role" },
            ]
        });

        const fileName = "users.csv";
        csvWriter.writeRecords(jsonData).then(() =>
            console.log("Write to users.csv successfully!"),
        );

        res.download("/users.csv" , fileName, (err) => {
            if (err) {
                res.status(500).send({
                    message: "Could not download the file. " + err,
                });
            }
        })

    } catch (error) {
        res.status(401).send({ error: error.message });
    }
})


// remove bulk users
router.post('/removeEmployees', async (req, res) => {
    userIds = req.body
    // console.log(any(STRING_TO_ARRAY(userIds)));
    try {
        await pool.query('DELETE FROM public.users WHERE id= any(STRING_TO_ARRAY($1,','));', [userIds]);
        res.json("Removed Employees Successfully!");
    } catch (error) {
        res.send({ error: error.message });
    }
})

module.exports = router;