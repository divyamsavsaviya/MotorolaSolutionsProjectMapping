const express = require('express');
const pool = require('../db.js');
const { authenticateToken } = require('../middleware/authorization.js');
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const path = require('path')

const router = express.Router()

// Add Project [post]
router.post('/',authenticateToken, async (req, res) => {
    try {
        const {
            projectname,
            deptcode,
            users,
            status,
            cieareaid,
            financeproductid,
            product
        } = req.body;

        const projectInsertQuery =
            'INSERT INTO public.projects(id, projectname, deptcode, users, status, createdat, updatedat, cieareaid, financeproductid , product) VALUES (DEFAULT,$1,$2,$3,$4,Now(),Now(),$5,$6,$7);';
        await pool.query(
            projectInsertQuery,
            [projectname, deptcode, users, status, cieareaid, financeproductid, product]);
        res.json({ message: "Project Added Successfully!" });
    } catch (error) {
        if (error.constraint === 'projects_pkey') {
            res.json({ error: "Project already exists!", errorType: 'project_exists', });
        } else {
            res.json({ error: error.message });
        }
    }
})

// get project list [get]
router.get('/',authenticateToken, async (req, res) => {
    try {
        const getProjectsQuery =
            "select * from projects";
        const projects = await pool.query(getProjectsQuery);
        if (projects.rows.length === 0) return res.json({ message: 'No Projects Found' });
        res.json({ projects: projects.rows });
    } catch (error) {
        res.json({ error: error.message });
    }
})


// get project Data [get]
router.get('/getProject', authenticateToken ,async (req, res) => {
    try {
        const { id } = req.body;
        const getProjectQuery =
            "select * from projects WHERE id=($1)";
        const project = await pool.query(
            getProjectQuery, [id]);
        if (project.rows.length === 1) {
            res.json({ project: project.rows[0] });
        } else {
            res.json({ error: "Project Not exists!" });
        }
    } catch (error) {
        res.json({ error: error.message });
    }
})

router.put('/', authenticateToken, async (req, res) => {
    const { id, users, status } = req.body;
    try {
        await pool.query('UPDATE public.projects SET users=($1), status=($2) , updatedat=Now() WHERE id=($3);',
            [users, status, id]);
        res.json("Project Updated Successfully!");
    } catch (error) {
        res.json({ error: error.message });
    }
})

// update project Name [put]
router.put('/updateProjectName', authenticateToken ,async (req, res) => {
    const { projectname, id } = req.body;
    try {
        await pool.query('UPDATE public.projects SET projectname=($1), updatedat=Now() WHERE id=($2);',
            [projectname, id]);
        res.json("Project name Updated Successfully!");
    } catch (error) {
        res.json({ error: error.message });
    }
})


// update project users [put]
router.put('/updateProjectUsers',authenticateToken, async (req, res) => {
    const { users, id } = req.body;
    try {
        await pool.query('UPDATE public.projects SET users=($1), updatedat=Now() WHERE id=($2);',
            [users, id]);
        res.json("Users Updated Successfully!");
    } catch (error) {
        res.json({ error: error.message });
    }
})

// update project Status[put]
router.put('/updateProjectStatus',authenticateToken, async (req, res) => {
    const { status, id } = req.body;
    try {
        await pool.query('UPDATE public.projects SET status=($1), updatedat=Now() WHERE id=($2);',
            [status, id]);
        res.json("Status Updated Successfully!");
    } catch (error) {
        res.json({ error: error.message });
    }
})

// remove project [delete]
router.post('/removeProject',authenticateToken, async (req, res) => {
    const { id } = req.body;
    try {
        await pool.query('DELETE FROM public.projects WHERE id=($1);',
            [id]);
        res.json("Project Removed Successfully!");
    } catch (error) {
        res.json({ error: error.message });
    }
})

// bulk import 
router.post('/importProjects',authenticateToken, async (req, res) => {
    const { projects } = req.body;
    const JSONProjects = JSON.parse(projects)
    try {
        JSONProjects.forEach(async project => {
            const projectInsertQuery =
                'INSERT INTO public.projects(id, projectname, deptcode, users, status, createdat, updatedat, cieareaid, financeproductid , product) VALUES (DEFAULT,$1,$2,$3,$4,Now(),Now(),$5,$6,$7);';
            await pool.query(
                projectInsertQuery,
                [project.projectname, project.deptcode, project.users, project.status, project.cieareaid, project.financeproductid, project.product]);
        })
        res.json({ message: "Projects Added Successfully!" });
    } catch (error) {
        if (error.constraint === 'projects_pkey') {
            res.json({ error: "Project already exists!", errorType: 'project_exists', });
        } else {
            res.json({ error: error.message });
        }
    }
})

// bulk export [get]]
// projects will export to backend/download/project.csv
router.get('/exportProjects',authenticateToken, async (req, res) => {
    try {
        const getProjectsQuery =
            "select * from projects";
        const projects = await pool.query(getProjectsQuery);
        if (projects.rows.length === 0) return res.json({ message: 'No Projects Found' });
        const jsonData = projects.rows;
        const fileName = "projects.csv";
        const csvWriter = createCsvWriter({
            path: "download/" + fileName,
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

        csvWriter.writeRecords(jsonData).then(() =>
            console.log("Write to projects.csv successfully!"),
        );

        const fileDirecoty = path.join(__dirname, '../download/');
        const file = path.resolve(fileDirecoty + fileName);
        res.download(file)

    } catch (error) {
        res.json({ error: error.message });
    }
})

// remove bulk projects
router.post('/removeProjects', authenticateToken, async (req, res) => {
    const { projectIds } = req.body;
    try {
        projectIds.forEach(async id => {
            await pool.query('DELETE FROM public.projects WHERE id=($1);', [id]);
        })
        res.json({ message: "Removed projects Successfully!" });

    } catch (error) {
        res.json({ error: error.message });
    }
})


module.exports = router;