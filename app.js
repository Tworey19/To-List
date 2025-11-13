const express = require('express');
const cors = require('cors'); 
const app = express();
const User = require('./models/User');
const db = require('./models/db');

app.use(express.json());


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    app.use(cors());
    next();
});

app.get("/", async (req, res) => {
    res.send("Página inicial - list");
});


app.get("/users", async (req, res) => {
    try {
        
        const users = await User.findAll({ order: [['id', 'DESC']] });
        return res.json({
            erro: false,
            users
        });
    } catch (error) {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Nenhuma tarefa encontrada."
        });
    }
});

app.post("/cadastrar", async (req, res) => {
    try {
       
        const user = await User.create(req.body);
        return res.json({
            erro: false,
            mensagem: "Tarefa cadastrada com sucesso!",
            user 
        });
    } catch (error) {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Tarefa não cadastrada com sucesso!"
        });
    }
});

app.delete("/deletar/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({ where: { id } });
        if (user === null) {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Tarefa não encontrada!"
            });
        }
        await User.destroy({ where: { id } });
        return res.json({
            erro: false,
            mensagem: "Tarefa deletada com sucesso!"
        });
    } catch (error) {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Não foi possível deletar a tarefa."
        });
    }
});

app.put("/atualizar/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [numberOfAffectedRows] = await User.update(req.body, { where: { id } });
        if (numberOfAffectedRows === 0) {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Tarefa não encontrada ou nenhum dado novo para atualizar."
            });
        }
        return res.json({
            erro: false,
            mensagem: "Tarefa atualizada com sucesso!"
        });
    } catch (error) {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Não foi possível atualizar a tarefa."
        });
    }
});

db.sync()
    .then(() => {
        console.log("Banco de dados sincronizado com sucesso.");
        app.listen(8080, () => {
            console.log("Servidor iniciado na porta 8080: http://localhost:8080");
        });
    })
    .catch((err) => {
        console.error("Erro ao sincronizar o banco de dados:", err);
    });