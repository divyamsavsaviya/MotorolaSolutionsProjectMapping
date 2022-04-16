const express = require('express');
const pool = require('../db.js');
const { authenticateToken } = require('../middleware/authorization.js');
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const router = express.Router()

// Add Project [post]
router.post('/', async (req, res) => {
    try {
        const {
            id,
            projectname,
            deptcode,
            users,
            status,
            cieareaid,
            financeproductid,
            product
        } = req.body;

        const projectInsertQuery =
            'INSERT INTO public.projects(id, projectname, deptcode, users, status, createdat, updatedat, cieareaid, financeproductid , product) VALUES ($1,$2,$3,$4,$5,Now(),Now(),$6,$7,$8);';
        const newProject = await pool.query(
            projectInsertQuery,
            [id, projectname, deptcode, users, status, cieareaid, financeproductid, product]);
        res.json({ message: "Project Added Successfully!" });
    } catch (error) {
        if (error.constraint === 'projects_pkey') {
            res.status(401).send({ error: "Project already exists!", errorType: 'project_exists' });
        } else {
            res.status(401).send({ error: error.message });
        }
    }
})

// get project list [get]
router.get('/', async (req, res) => {
    try {
        const getProjectsQuery =
            "select * from projects";
        const projects = await pool.query(getProjectsQuery);
        if (projects.rows.length === 0) return res.json({ message: 'No Projects Found' });
        res.json({ projects: projects.rows });
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
})


// get project Data [get]
router.get('/getProject', async (req, res) => {
    try {
        const { id } = req.body;
        const getProjectQuery =
            "select * from projects WHERE id=($1)";
        const project = await pool.query(
            getProjectQuery, [id]);
        if (project.rows.length === 1) {
            res.json({ project: project.rows[0] });
        } else {
            res.status(400).json({ error: "Project Not exists!" });
        }
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
})

router.put('/', async (req, res) => {
    const { id, users, status } = req.body;
    try {
        await pool.query('UPDATE public.projects SET users=($1), status=($2) , updatedat=Now() WHERE id=($3);',
            [users, status, id]);
        res.json("Project Updated Successfully!");
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
})

// update project Name [put]
router.put('/updateProjectName', async (req, res) => {
    const { projectname, id } = req.body;
    try {
        await pool.query('UPDATE public.projects SET projectname=($1), updatedat=Now() WHERE id=($2);',
            [projectname, id]);
        res.json("Project name Updated Successfully!");
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
})


// update project users [put]
router.put('/updateProjectUsers', async (req, res) => {
    const { users, id } = req.body;
    try {
        await pool.query('UPDATE public.projects SET users=($1), updatedat=Now() WHERE id=($2);',
            [users, id]);
        res.json("Users Updated Successfully!");
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
})

// update project Status[put]
router.put('/updateProjectStatus', async (req, res) => {
    const { status, id } = req.body;
    try {
        await pool.query('UPDATE public.projects SET status=($1), updatedat=Now() WHERE id=($2);',
            [status, id]);
        res.json("Status Updated Successfully!");
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
})

// remove project [delete]
router.post('/removeProject', async (req, res) => {
    const { id } = req.body;
    try {
        await pool.query('DELETE FROM public.projects WHERE id=($1);',
            [id]);
        res.json("Project Removed Successfully!");
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
})

// bulk import 


// bulk export [get]]
// projects will export to backend/download/project.csv
router.get('/exportProjects', async (req, res) => {
    try {
        const getProjectsQuery =
            "select * from projects";
        const projects = await pool.query(getProjectsQuery);
        if (projects.rows.length === 0) return res.json({ message: 'No Projects Found' });
        const jsonData = projects.rows;
        const csvWriter = createCsvWriter({
            path: "download/projects.csv",

            header: [
                { id: "id", title: "id" },
                { id: "projectname", title: "projectname" },
                { id: "deptcode", title: "deptcode" },
                { id: "users", title: "users" },
                { id: "product", title: "product" },
                { id: "status", title: "status" },
                { id: "createdat", title: "createdat" },
                { id: "updatedat", title: "updatedat" },
                { id: "cieareaid", title: "cieareaid" },
                { id: "financeproductid", title: "financeproductid" },
            ]
        });

        const fileName = "projects.csv";
        csvWriter.writeRecords(jsonData).then(() =>
            console.log("Write to projects.csv successfully!"),
        );

        res.download("download/projects.csv" , fileName, (err) => {
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


module.exports = router;