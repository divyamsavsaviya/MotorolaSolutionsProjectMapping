const express = require('express');
const pool = require('../db.js');
const bcrypt = require('bcrypt');
const { authenticateToken } = require('../middleware/authorization.js');
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const router = express.Router()

// Add employee
router.post('/',authenticateToken, async (req, res) => {
    try {
        const { email, password, name, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newEmployee = await pool.query(
            'INSERT INTO public.users (id , email, password, name , role) VALUES (DEFAULT ,$1,$2,$3,$4)',
            [email, hashedPassword, name, role]);
        res.json({ employees: newEmployee.rows[0] });
    } catch (error) {
        if (error.constraint === 'employees_pkey') {
            res.json({ error: "User already exists!", errorType: 'user_exists' });
            console.log(error.message);
        } else {
            res.json({ error: error.message });
        }
    }
})

// get employees list
router.get('/', authenticateToken, async (req, res) => {
    try {
        employees = await pool.query('SELECT id, email, name, role FROM public.users;');
        if (employees.rows.length === 0) return res.json({ message: 'No users Found' });
        res.json({ employees: employees.rows });
    } catch (error) {
        res.json({ error: error.message });
    }
})


// return employee information
router.get('/getEmployeeInformation', authenticateToken, async (req, res) => {
    try {
        const { id } = req.body;
        const employee = await pool.query('SELECT email, name, role FROM public.users WHERE id=($1)',
            [id]);
        if (employee.rows.length === 1) {
            res.json(employee.rows[0]);
        } else {
            res.json({ message: "User Not exists!" });
        }
    } catch (error) {
        res.json({ error: error.message });
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
            res.json({ error: "User exists with email " + email, errorType: 'invalid_email' });
        } else {
            res.json({ error: error.message });
        }
    }
})

// updates employee role
router.put('/updateRole',authenticateToken, async (req, res) => {
    const { role, id } = req.body;
    console.log(id ,role);
    try {
        employee = await pool.query('UPDATE public.users SET role=($1) WHERE id=($2);',
            [role, id]);
        res.json("Role Updated Successfully! for id => " + id + " to " + role);
    } catch (error) {
        res.json({ error: error.message });
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
        res.json({ error: error.message });
    }
})

// removes employee
router.post('/removeEmployee',authenticateToken, async (req, res) => {
    const { id } = req.body;
    try {
        await pool.query('DELETE FROM public.users WHERE id=$1;', [id]);
        res.json("Removed Employee Successfully!");
    } catch (error) {
        res.json({ error: error.message });
    }
})

// bulk import 
router.post('/importUsers', authenticateToken,async (req, res) => {
    const { users } = req.body;
    const JSONUsers = JSON.parse(users)
    try {
        JSONUsers.forEach(async user => {
            console.log("user => ", user);
            const hashedPassword = await bcrypt.hash(user.password, 10);
            const userInsertQuery =
                'INSERT INTO public.users (email, password, name , role,id) VALUES ($1,$2,$3,$4,DEFAULT)';
            await pool.query(
                userInsertQuery,
                [user.email, hashedPassword, user.name, user.role]);
        })
        res.json({ message: "Users Added Successfully!", success: true });
    } catch (error) {
        if (error.constraint === 'employees_pkey') {
            res.json({ error: "Users already exists!", errorType: 'user_exists', });
        } else {
            res.json({ error: error.message });
        }
    }
})

// bulk export [get]]
router.get('/exportEmployees',authenticateToken, async (req, res) => {
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

        res.download("/users.csv", fileName, (err) => {
            if (err) {
                res.status(500).send({
                    message: "Could not download the file. " + err,
                });
            }
        })

    } catch (error) {
        res.json({ error: error.message });
    }
})

// remove bulk users
router.post('/removeEmployees', authenticateToken ,async (req, res) => {
    const { userIds } = req.body;
    console.log(userIds);
    let deletedIds = [];
    try {
        userIds.forEach(async id => {
            await pool.query('DELETE FROM public.users WHERE id=($1);', [id]);
            deletedIds.push(id);
        })
        res.json({ message: "Removed Users with ids - " + deletedIds.join(",") + " Successfully!" });
    } catch (error) {
        res.json({ error: error.message });
    }
})

module.exports = router;