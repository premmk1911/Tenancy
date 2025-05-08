const express = require('express');
const Project = require('../models/Project');
const { authenticate, authorize } = require('../middleware/auth'); // Added authenticate

const projectRouter = express.Router();

// ✅ Create Project (Only Admin & Manager)
projectRouter.post('/:tenantId', authenticate, authorize(['Admin', 'Manager']), async (req, res) => {
  try {
    const { name, description, managerId } = req.body;

    const project = new Project({
      tenantId: req.params.tenantId,
      name,
      description,
      managerId,
    });

    await project.save();
    console.log('✅ Project Created:', project);
    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    console.error('❌ Error creating project:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ Get All Projects (Tenant-Specific)
projectRouter.get('/:tenantId', authenticate, authorize(['Admin', 'Manager', 'Viewer']), async (req, res) => {
  try {
    const projects = await Project.find({ tenantId: req.params.tenantId });
    console.log('✅ Projects Fetched:', projects);
    res.json(projects);
  } catch (error) {
    console.error('❌ Error fetching projects:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ Update Project (Only Admin & Manager)
projectRouter.put('/:tenantId/:projectId', authenticate, authorize(['Admin', 'Manager']), async (req, res) => {
  try {
    const { name, description, managerId } = req.body;
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.projectId,
      { name, description, managerId },
      { new: true }
    );

    if (!updatedProject) {
      console.log('❌ Project not found');
      return res.status(404).json({ error: 'Project not found' });
    }

    console.log('✅ Project Updated:', updatedProject);
    res.json({ message: 'Project updated successfully', updatedProject });
  } catch (error) {
    console.error('❌ Error updating project:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ Delete Project (Only Admin)
projectRouter.delete('/:tenantId/:projectId', authenticate, authorize(['Admin']), async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.projectId);
    if (!deletedProject) {
      console.log('❌ Project not found');
      return res.status(404).json({ error: 'Project not found' });
    }

    console.log('✅ Project Deleted:', deletedProject);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting project:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = projectRouter;
