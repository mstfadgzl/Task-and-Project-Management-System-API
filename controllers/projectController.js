const Project = require('../models/Project');
const Task = require('../models/Task');
const mongoose = require('mongoose');

exports.createProject = async (req, res) => {
    try {
        const { title, description } = req.body;
        const newProject = new Project({ title, description });
        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (err) {
        res.status(500).json({ error: "Proje kaydedilirken sorun oluştu" });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) return res.status(404).json({ error: "Proje bulunamadı" });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: "Proje getirilirken hata oluştu" });
    }
};

exports.getProjectStats = async (req, res) => {
    try {
        const { projectId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(projectId)) return res.status(400).json({ error: "Geçersiz Proje ID formatı." });

        const projectExists = await Project.findById(projectId);
        if (!projectExists) return res.status(404).json({ error: "Proje bulunamadı." });

        const totalTasks = await Task.countDocuments({ projectId: projectId });
        const completedTasks = await Task.countDocuments({ projectId: projectId, status: 'DONE' });
        
        let percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        res.json({
            "Toplam görev sayısı": totalTasks,
            "Biten (DONE) görev sayısı": completedTasks,
            "Projenin tamamlanma yüzdesi": `%${percentage}`
        });
    } catch (err) {
        res.status(500).json({ error: "İstatistikler hesaplanırken sunucu hatası oluştu." });
    }
};