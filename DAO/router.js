import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';

const app = express();
app.use(express.json()); 
app.use(cors());


const conexao = mysql.createConnection({
  //Retirei os dados
});

conexao.connect((erro) => {
  if (erro) {
    console.log('Erro ao conectar no banco:', erro);
  } else {
    console.log('Banco conectado com sucesso!');
  }
});


app.post('/login', (req, res) => {
  const { usuario, senha } = req.body;

  
  const sqlUsuario = 'SELECT id_users AS id, nome_user AS usuario FROM tb_Usuario WHERE nome_user = ? AND senha = ?';
  
  conexao.query(sqlUsuario, [usuario, senha], (erro, resUser) => {
    if (erro) return res.status(500).json(erro);

    if (resUser.length > 0) {
      return res.status(200).json({ mensagem: 'Login realizado com sucesso', user: resUser[0] });
    }

    const sqlDev = 'SELECT id_usuario AS id, usuario_nome AS usuario FROM tb_Devs WHERE usuario_nome = ? AND senha = ?';
    conexao.query(sqlDev, [usuario, senha], (erroDev, resDev) => {
      if (erroDev) return res.status(500).json(erroDev);

      if (resDev.length > 0) {
        return res.status(200).json({ mensagem: 'Login realizado com sucesso', user: resDev[0] });
      }

      return res.status(401).json({ message: 'Usuário ou senha inválidos!' });
    });
  });
});


app.get('/usuarios', (req, res) => {
  const sql = 'SELECT id_users AS id, nome_user AS usuario, nome FROM tb_Usuario';
  conexao.query(sql, (erro, resultado) => {
    if (erro) return res.status(500).json(erro);
    res.json(resultado);
  });
});


app.get('/usuario/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT id_users AS id, nome_user AS usuario, nome FROM tb_Usuario WHERE id_users = ?';

  conexao.query(sql, [id], (erro, resultado) => {
    if (erro) return res.status(500).json(erro);
    if (resultado.length === 0) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }
    res.json(resultado[0]);
  });
});

app.get('/tarefas', (req, res) => {
  const sql = 'SELECT id_tarefa AS id, descr_tarefa, DATE_FORMAT(dataConclusao, "%d/%m/%y") AS dataConclusao, tempoExecucao, status, relevancia FROM tb_Tarefas';
  conexao.query(sql, (erro, resultado) => {
    if (erro) return res.status(500).json(erro);
    res.json(resultado);
  });
});


app.get('/tarefasUsuario/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT id_tarefa AS id, descr_tarefa, DATE_FORMAT(dataConclusao, "%d/%m/%y") AS dataConclusao, tempoExecucao, status, relevancia FROM tb_Tarefas WHERE id_usuario = ?';

  conexao.query(sql, [id], (erro, resultado) => {
    if (erro) return res.status(500).json(erro);
    res.json(resultado);
  });
});


app.get('/desenvolvedores', (req, res) => {
  const sql = 'SELECT id_usuario AS id, usuario_nome AS usuario, nome FROM tb_Devs';
  conexao.query(sql, (erro, resultado) => {
    if (erro) return res.status(500).json(erro);
    res.json(resultado);
  });
});


// pra cirar uma nova tarefa
app.post('/tarefas', (req, res) => {
  const { descr_tarefa, dataConclusao, tempoExecucao, status, relevancia, id_usuario } = req.body;

  if (!descr_tarefa || !id_usuario) {
    return res.status(400).json({ mensagem: 'Descrição e ID do usuário são obrigatórios!' });
  }

  const sql = `
    INSERT INTO tb_Tarefas (descr_tarefa, dataConclusao, tempoExecucao, status, relevancia, id_usuario) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  conexao.query(sql, [descr_tarefa, dataConclusao, tempoExecucao, status || 'Pendente', relevancia, id_usuario], (erro, resultado) => {
    if (erro) return res.status(500).json(erro);
    res.status(201).json({ mensagem: 'Tarefa criada com sucesso!', id: resultado.insertId });
  });
});

// Atualizar tarefa por ID
// Atualizar tarefa por ID
app.put('/tarefas/:id', (req, res) => {
  const { id } = req.params;
  const { descr_tarefa, dataConclusao, tempoExecucao, status, relevancia } = req.body;

  const sql = `
    UPDATE tb_Tarefas 
    SET descr_tarefa = ?, dataConclusao = ?, tempoExecucao = ?, status = ?, relevancia = ? 
    WHERE id_tarefa = ?
  `;

  conexao.query(sql, [descr_tarefa, dataConclusao, tempoExecucao, status, relevancia, id], (erro, resultado) => {
    if (erro) return res.status(500).json(erro);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Tarefa não encontrada!' });
    }

    res.json({ mensagem: 'Tarefa atualizada com sucesso!' });
  });
});

// Deletar tarefa por ID
// Deletar tarefa por ID
app.delete('/tarefas/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM tb_Tarefas WHERE id_tarefa = ?';

  conexao.query(sql, [id], (erro, resultado) => {
    if (erro) {
      console.error('Erro ao excluir tarefa:', erro);
      return res.status(500).json(erro);
    }

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Tarefa não encontrada!' });
    }

    res.json({ mensagem: 'Tarefa excluída com sucesso!' });
  });
});

// Criar novo usuário
app.post('/usuarios', (req, res) => {
  const { nome_user, senha, nome } = req.body;

  if (!nome_user || !senha) {
    return res.status(400).json({ mensagem: 'Usuário e senha são obrigatórios!' });
  }

  const sql = 'INSERT INTO tb_Usuario (nome_user, senha, nome) VALUES (?, ?, ?)';

  conexao.query(sql, [nome_user, senha, nome], (erro, resultado) => {
    if (erro) return res.status(500).json(erro);
    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!', id: resultado.insertId });
  });
});

// Deletar usuário por ID
app.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM tb_Usuario WHERE id_users = ?';

  conexao.query(sql, [id], (erro, resultado) => {
    if (erro) return res.status(500).json(erro);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado!' });
    }

    res.json({ mensagem: 'Usuário removido com sucesso!' });
  });
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});

export default app;
