// import express from "express";
// import { createClient } from '@supabase/supabase-js';
// import path from 'path';
// import bodyParser from 'body-parser';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();

// // 🔹 Configuração do Supabase
// const supabaseUrl = 'https://bnbeyejgjwhneesdnxbw.supabase.co';
// const supabaseKey = 'SUA_CHAVE_SUPABASE_AQUI';
// const supabase = createClient(supabaseUrl, supabaseKey);

// // 🔹 Configurações do Express
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('public'));
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // --- Funções de Banco ---
// async function criarPagamento(nome, forma_pagamento, valor_pago, presente, acompanhante) {
//     const { error } = await supabase
//         .from('pagamentos')
//         .insert([{
//             nome,
//             forma_pagamento,
//             valor_pago,
//             presente,
//             acompanhante: acompanhante || null
//         }]);

//     if (error) console.error('Erro ao criar pagamento:', error);
//     else console.log('Pagamento registrado:', nome);
// }

// async function lerPagamentos() {
//     const { data, error } = await supabase
//         .from('pagamentos')
//         .select('*')
//         .order('nome', { ascending: true });

//     if (error) {
//         console.error('Erro ao ler pagamentos:', error);
//         return [];
//     }
//     return data;
// }

// async function editarPagamento(id, nome, forma_pagamento, valor_pago, presente, acompanhante) {
//     const { error } = await supabase
//         .from('pagamentos')
//         .update({
//             nome,
//             forma_pagamento,
//             valor_pago,
//             presente,
//             acompanhante: acompanhante || null
//         })
//         .eq('id', id);

//     if (error) console.error('Erro ao editar pagamento:', error);
//     else console.log('Pagamento editado:', nome);
// }

// async function deletarPagamento(id) {
//     const { error } = await supabase
//         .from('pagamentos')
//         .delete()
//         .eq('id', id);

//     if (error) console.error('Erro ao deletar pagamento:', error);
//     else console.log('Pagamento deletado:', id);
// }

// // --- Rotas ---
// app.get('/', async (req, res) => {
//     const pagamentos = await lerPagamentos();
//     const listaPessoas = pagamentos.map(p => ({ id: p.id, nome: p.nome }));
//     res.render('index', { pagamentos, listaPessoas });
// });

// app.post('/criar-pagamento', async (req, res) => {
//     const { nome, forma_pagamento, valor_pago, presente, acompanhante } = req.body;
//     await criarPagamento(
//         nome,
//         forma_pagamento,
//         valor_pago,
//         presente === 'on',
//         acompanhante || null
//     );
//     res.redirect('/');
// });

// app.post('/editar-pagamento', async (req, res) => {
//     const { id, nome, forma_pagamento, valor_pago, presente, acompanhante } = req.body;
//     await editarPagamento(
//         id,
//         nome,
//         forma_pagamento,
//         valor_pago,
//         presente === 'on',
//         acompanhante || null
//     );
//     res.redirect('/');
// });

// app.get('/deletar-pagamento/:id', async (req, res) => {
//     const { id } = req.params;
//     await deletarPagamento(id);
//     res.redirect('/');
// });

// // --- Inicialização ---
// app.listen(3000, () => {
//     console.log("Servidor rodando na porta 3000...");
// });

import express from "express";
import path from "path";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Abre/Cria o banco SQLite de forma assíncrona
let db;
async function initDb() {
  db = await open({
    filename: "./pagamentos.db",
    driver: sqlite3.Database,
  });

  // Cria tabela se não existir
  await db.exec(`
    CREATE TABLE IF NOT EXISTS pagamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      forma_pagamento TEXT NOT NULL,
      valor_pago REAL NOT NULL,
      presente INTEGER NOT NULL DEFAULT 0,
      acompanhante INTEGER,
      FOREIGN KEY(acompanhante) REFERENCES pagamentos(id)
    )
  `);
}

await initDb();

// Funções CRUD
async function criarPagamento(nome, forma_pagamento, valor_pago, presente, acompanhante) {
  await db.run(
    `INSERT INTO pagamentos (nome, forma_pagamento, valor_pago, presente, acompanhante) VALUES (?, ?, ?, ?, ?)`,
    [nome, forma_pagamento, valor_pago, presente ? 1 : 0, acompanhante || null]
  );
  console.log("Pagamento registrado:", nome);
}

async function lerPagamentos() {
  return await db.all(`SELECT * FROM pagamentos ORDER BY nome ASC`);
}

async function editarPagamento(id, nome, forma_pagamento, valor_pago, presente, acompanhante) {
  await db.run(
    `UPDATE pagamentos SET nome = ?, forma_pagamento = ?, valor_pago = ?, presente = ?, acompanhante = ? WHERE id = ?`,
    [nome, forma_pagamento, valor_pago, presente ? 1 : 0, acompanhante || null, id]
  );
  console.log("Pagamento editado:", nome);
}

async function deletarPagamento(id) {
  await db.run(`DELETE FROM pagamentos WHERE id = ?`, [id]);
  console.log("Pagamento deletado:", id);
}

// Rotas
app.get("/", async (req, res) => {
  const pagamentos = await lerPagamentos();
  const listaPessoas = pagamentos.map((p) => ({ id: p.id, nome: p.nome }));
  res.render("index", { pagamentos, listaPessoas });
});

app.post("/criar-pagamento", async (req, res) => {
  const { nome, forma_pagamento, valor_pago, presente, acompanhante } = req.body;
  await criarPagamento(
    nome,
    forma_pagamento,
    parseFloat(valor_pago),
    presente === "on",
    acompanhante || null
  );
  res.redirect("/");
});

app.post("/editar-pagamento", async (req, res) => {
  const { id, nome, forma_pagamento, valor_pago, presente, acompanhante } = req.body;
  await editarPagamento(
    id,
    nome,
    forma_pagamento,
    parseFloat(valor_pago),
    presente === "on",
    acompanhante || null
  );
  res.redirect("/");
});

app.get("/deletar-pagamento/:id", async (req, res) => {
  const { id } = req.params;
  await deletarPagamento(id);
  res.redirect("/");
});

// Inicialização do servidor
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000...");
});
