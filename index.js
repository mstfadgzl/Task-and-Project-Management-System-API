// İskelet ➡️ Model ➡️ Controller ➡️ Router ➡️ Bağlantı.

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Rotaları içeri aktar
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Middleware'ler
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Rotaları Express'e bağla
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// MongoDB Bağlantısı ve Sunucuyu Başlatma
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Bağlandı');
        const listener = app.listen(process.env.PORT || 3000, () => {
            console.log('Port = ' + listener.address().port);
        });
    })
    .catch((err) => {
        console.log('MongoDB Bağlantı Hatası:', err);
    });