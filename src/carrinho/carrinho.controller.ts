

import { Request, Response } from "express";
import { db } from '../database/banco-mongo.js';
import { ObjectId } from 'mongodb';

interface ItemCarrinho {
  produtoId: string;
  nome: string;
  quantidade: number;
  precoUnitario: number;
}

interface Carrinho {
  usuarioId: string;
  itens: ItemCarrinho[];
  dataAtual: Date;
  total: number;
}

// Simulação de armazenamento em memória
const carrinhos: Carrinho[] = [];


const carrinhoController = {
  adicionarItem: async (req: Request, res: Response) => {
    const { usuarioId, produtoId, quantidade } = req.body;
    if (!usuarioId || !produtoId || !quantidade) {
      return res.status(400).json({ mensagem: "usuarioId, produtoId e quantidade são obrigatórios" });
    }
    let produtoObjectId;
    try {
      produtoObjectId = new ObjectId(produtoId);
    } catch (e) {
      return res.status(400).json({ mensagem: "produtoId inválido" });
    }
    // Buscar produto no banco
    const produto = await db.collection('produtos').findOne({ _id: produtoObjectId });
    if (!produto) {
      return res.status(404).json({ mensagem: "Produto não encontrado" });
    }
    let carrinho = carrinhos.find(c => c.usuarioId === usuarioId);
    if (!carrinho) {
      carrinho = {
        usuarioId,
        itens: [],
        dataAtual: new Date(),
        total: 0
      };
      carrinhos.push(carrinho);
    }
    // Só pode um tipo de produto por carrinho
    let itemExistente = carrinho.itens.find(i => i.produtoId === produtoId);
    if (itemExistente) {
      itemExistente.quantidade += quantidade;
    } else {
      carrinho.itens.push({
        produtoId,
        nome: produto.nome,
        quantidade,
        precoUnitario: produto.preco
      });
    }
    carrinho.dataAtual = new Date();
    carrinho.total = carrinho.itens.reduce((acc, item) => acc + item.quantidade * item.precoUnitario, 0);
    res.status(201).json(carrinho);
  },

  removerItem: (req: Request, res: Response) => {
    const { usuarioId, produtoId } = req.body;
    const carrinho = carrinhos.find(c => c.usuarioId === usuarioId);
    if (!carrinho) return res.status(404).json({ mensagem: "Carrinho não encontrado" });
    carrinho.itens = carrinho.itens.filter(i => i.produtoId !== produtoId);
    carrinho.total = carrinho.itens.reduce((acc, item) => acc + item.quantidade * item.precoUnitario, 0);
    carrinho.dataAtual = new Date();
    res.json(carrinho);
  },

  atualizarQuantidade: (req: Request, res: Response) => {
    const { usuarioId, produtoId, quantidade } = req.body;
    const carrinho = carrinhos.find(c => c.usuarioId === usuarioId);
    if (!carrinho) return res.status(404).json({ mensagem: "Carrinho não encontrado" });
    const item = carrinho.itens.find(i => i.produtoId === produtoId);
    if (!item) return res.status(404).json({ mensagem: "Item não encontrado" });
    item.quantidade = quantidade;
    carrinho.total = carrinho.itens.reduce((acc, item) => acc + item.quantidade * item.precoUnitario, 0);
    carrinho.dataAtual = new Date();
    res.json(carrinho);
  },

  listar: (req: Request, res: Response) => {
    const { usuarioId } = req.query;
    if (!usuarioId || typeof usuarioId !== 'string') return res.status(400).json({ mensagem: "usuarioId é obrigatório" });
    const carrinho = carrinhos.find(c => c.usuarioId === usuarioId);
    if (!carrinho) return res.status(404).json({ mensagem: "Carrinho não encontrado" });
    res.json(carrinho);
  },

  remover: (req: Request, res: Response) => {
    const { usuarioId } = req.body;
    const index = carrinhos.findIndex(c => c.usuarioId === usuarioId);
    if (index === -1) return res.status(404).json({ mensagem: "Carrinho não encontrado" });
    carrinhos.splice(index, 1);
    res.json({ mensagem: "Carrinho removido" });
  }
};

//adicionar item 
//apagar item
//atualizar quantidade
//listar 
//apagar carrinho
//um carrinho para cada usuario, um tipo de produto por carrinho
//buscar produto no banco de dados para pegar o preço e nome
//ao adicionar um item, verificar se o carrinho do usuário já existe
//se existir, verificar se o produto já está no carrinho
//se estiver, atualizar a quantidade
//se não estiver, adicionar o novo item
//se o carrinho não existir, criar um novo carrinho com o item

export default carrinhoController;
