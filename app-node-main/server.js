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
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 🔹 Conexão com Supabase (usando sua URL e API key)
const supabase = createClient(
  "https://zwqtslbyktbwrmdxnaxg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3cXRzbGJ5a3Rid3JtZHhuYXhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMjUwMDQsImV4cCI6MjA3MDYwMTAwNH0.knTnH4KHvmNyFvWcuAQbXC1hKY3dHbC-qn-kqGN8xBs"
);

// Funções CRUD
async function criarPagamento(nome, forma_pagamento, valor_pago, presente, acompanhante) {
  const { error } = await supabase
    .from("pagamentos")
    .insert([
      {
        nome,
        forma_pagamento,
        valor_pago,
        presente,
        acompanhante: acompanhante || null
      }
    ]);

  if (error) console.error("Erro ao criar pagamento:", error);
}

async function lerPagamentos() {
  const { data, error } = await supabase
    .from("pagamentos")
    .select("*")
    .order("nome", { ascending: true });

  if (error) {
    console.error("Erro ao ler pagamentos:", error);
    return [];
  }

  return data;
}

async function editarPagamento(id, nome, forma_pagamento, valor_pago, presente, acompanhante) {
  const { error } = await supabase
    .from("pagamentos")
    .update({
      nome,
      forma_pagamento,
      valor_pago,
      presente,
      acompanhante: acompanhante || null
    })
    .eq("id", id);

  if (error) console.error("Erro ao editar pagamento:", error);
}

async function deletarPagamento(id) {
  const { error } = await supabase
    .from("pagamentos")
    .delete()
    .eq("id", id);

  if (error) console.error("Erro ao deletar pagamento:", error);
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
