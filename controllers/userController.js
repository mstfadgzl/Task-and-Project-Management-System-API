const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Bu email zaten kullanılmaktadır" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ name, email, password: hashedPassword, role });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        console.error('Kayıt Hatası:', err);
        res.status(500).json({ error: "Kullanıcı kayıt olurken hata oluştu" });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Kullanıcılar getirilirken bir sorun oluştu" });
    }
};

exports.loginUser = async function (req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı" });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ error: "Hatalı şifre" });

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ message: "Giriş başarılı", token: token })
    } catch (err) {
        console.log("LOGIN HATASI DETAYI:", err);
        res.status(500).json({ error: "Giriş yapılırken hata oluştu" });
    }
};