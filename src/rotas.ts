
import usuarioController from "./usuarios/usuario.controller.js";
import produtoController from "./produtos/produto.controller";
import carrinhoController from "./carrinho/carrinho.controller";

import { Router } from "express";

const rotas = Router();

//Criando rotas de usuario
rotas.post("/usuario", usuarioController.adicionar);
rotas.get("/usuario", usuarioController.listar);


// Rotas de produtos
rotas.post("/produto", produtoController.adicionar);
rotas.get("/produto", produtoController.listar);


// Rotas de carrinho
rotas.post("/adicionarItem", carrinhoController.adicionarItem);
rotas.delete("/remover-item", carrinhoController.removerItem);
rotas.put("/atualizar-quantidade", carrinhoController.atualizarQuantidade);
rotas.get("/carrinho", carrinhoController.listar);
rotas.delete("/remover", carrinhoController.remover);


export default rotas;