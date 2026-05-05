const mongoose=require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['TODO', 'IN_PROGRESS', 'DONE'],
        default: 'TODO'
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dueDate: {
        type: Date
    },
    attachments: [{
        filename: { type: String },
        path: { type: String },
        uploadedAt: { type: Date, default: Date.now }
    }]
});

const Task = mongoose.model('Task', taskSchema);