//require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: './uploads' });
const fs = require('fs');
const Post = require('./models/Post');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();

const salt = bcrypt.genSaltSync(10);
const MONGO = "mongodb://mongo:gOUiqFBdycmJAoYeiyIczeMljhnpASFx@autorack.proxy.rlwy.net:26321"
const secret = "73ff7c3ffb42fe464986b8389dad203d";
const URL_FRONTEND = "http://localhost:3002"
const PORT = 3001


app.use(express.json());
app.use(cors({
    credentials: true,
    origin: URL_FRONTEND,
}));
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

// Conexión a MongoDB con mongoose sin opciones obsoletas
mongoose.connect(MONGO);

const client = new MongoClient(MONGO, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        await client.close();
    }
}
run().catch(console.dir);

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userInfo = await User.create({
            username,
            password: bcrypt.hashSync(password, salt),
        });
        res.json(userInfo);
    } catch (e) {
        res.status(400).json(e);
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userInfo = await User.findOne({ username });
        if (!userInfo) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }

        const passOk = bcrypt.compareSync(password, userInfo.password);
        if (passOk) {
            jwt.sign({ username, id: userInfo._id }, secret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'None',
                }).json({
                    id: userInfo._id,
                    username,
                });
            });
        } else {
            res.status(400).json({ error: 'Contraseña incorrecta' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) return res.status(403).json({ error: 'Token verification failed' });
        res.json(info);
    });
});

app.post('/logout', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 0,
    }).json('ok logout');
});

app.post("/post", uploadMiddleware.single('file'), async (req, res) => {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { tittle, summary, content } = req.body;
        const PostDoc = await Post.create({
            tittle,
            summary,
            content,
            cover: newPath,
            author: info.id
        });
        res.json(PostDoc);
    });
});

app.get("/post", async (req, res) => {
    res.json(
        await Post.find()
            .populate('author', ['username'])
            .sort({ createdAt: -1 })
            .limit(20)
    );
});

app.get("/post/:id", async (req, res) => {
    const { id } = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
});

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;
    if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
    }

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { id, tittle, summary, content } = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (!isAuthor) {
            return res.status(400).json('you are not the author');
        }
        await postDoc.updateOne({
            tittle,
            summary,
            content,
            cover: newPath ? newPath : postDoc.cover,
        });
        res.json(postDoc);
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
