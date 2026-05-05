const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');


exports.createTask = async function (req, res) {
    const { projectId } = req.params;
    const { title, status, assignedTo, dueDate } = req.body;
    try {
        const existingProjectId = await Project.findById(projectId);
        if (!existingProjectId) {
            return res.status(404).json({ error: "Belirtilen ID'ye sahip bir proje bulunamadı" });
        }
        const userExists = await User.findById(assignedTo);
        if (!userExists) {
            return res.status(404).json({ error: "Belirtilen ID'ye sahip bir kullanıcı bulunamadı" });
        }

        const newTask = new Task({
            title: title,
            status: status,
            projectId: projectId,
            assignedTo: assignedTo,
            dueDate: dueDate
        });

        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (err) {
        console.log('HATA MESAJI', err);
        res.status(500).json({ error: "Görev oluşturulurken sunucu hatası meydana geldi" });
    }
};

exports.updateTaskStatus= async function (req, res) {
    const { taskId } = req.params;
    const { newStatus } = req.body;
    try {
        const allowedStatus = ['TODO', 'IN_PROGRESS', 'DONE'];
        if (!allowedStatus.includes(newStatus)) {
            return res.status(400).json({
                error: "Geçersiz durum değeri! Sadece 'TODO', 'IN_PROGRESS' veya 'DONE' kullanılabilir."
            });
        }
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { status: newStatus },
            { returnDocument: 'after' }
        );
        if (!updatedTask) {
            return res.json({ error: "Belirtilen Id ye sahip görev bulunamadı" });
        }
        res.json(updatedTask);
    } catch (err) {
        console.error('Durum Güncelleme Hatası:', err);
        res.status(500).json({ error: "Görev durumu güncellenirken sunucu hatası oluştu." });
    }
};


//    FİLTRELEME SİSTEMİ

exports.getTasks= async function (req, res) {
    try {
        const { projectId, assignedTo, status } = req.query;
        const filter = {};

        if (projectId) {
            filter.projectId = projectId;
        }
        if (assignedTo) {
            filter.assignedTo = assignedTo;
        }
        if (status) {
            filter.status = status;
        }
        const tasks = await Task.find(filter)
            .populate('assignedTo', 'name email') // User'ın adı ve maili gelsin
            .populate('projectId', 'title');      // Projenin sadece başlığı gelsin
        res.json(tasks);
    } catch (err) {
        console.error('Görevleri Getirme Hatası:', err);
        res.status(500).json({ error: "Görevler getirilirken sunucu hatası oluştu." });
    }
};

//               MULTER  DOSYA EKLEME

exports.uploadAttachment = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "Lütfen dosya seçiniz" });

        const task = await Task.findById(req.params.taskId);
        if (!task) return res.status(404).json({ error: "Görev bulunamadı." });

        task.attachments.push({
            filename: req.file.originalname,
            path: req.file.path
        });

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: "Dosya yüklenirken sunucu hatası oluştu." });
    }
};
