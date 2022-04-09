const express = require('express');
const pool = require('../db.js');
const { authenticateToken } = require('../middleware/authorization.js')

const router = express.Router()

router.get('/' , async (req, res) => {
    console.log("api/projects/");
    try {
        project = await pool.query(
            'SELECT * FROM public.projects;');
            res.json({ projects: projects.rows });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
})

router.post('/', async (req, res) => {
    try {
        const { id, projectName, deptCode, users, status, createdAt, updateAt, cieAreaId, financeProductId } = req.body;
        const newProject = await pool.query(
            'INSERT INTO public.projects(id, "projectName", "deptCode", users, status, "createdAt", "updateAt", "cieAreaId", "financeProductId") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [id, projectName, deptCode, users, status, createdAt, updateAt, cieAreaId, financeProductId]);
        res.json({ projects: newProject.rows[0] });
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
})

module.exports = router;