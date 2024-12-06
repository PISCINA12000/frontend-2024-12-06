import { createSlice } from "@reduxjs/toolkit"
import { createAsyncThunk } from "@reduxjs/toolkit"
import { alterarProduto, consultarProduto, excluirProduto, gravarProduto } from "../servicos/servicoProduto"

import ESTADO from "./estados"
import { act } from "react"

export const buscarProdutos = createAsyncThunk('buscarProdutos', async () => {
    //lista de produtos
    const resultado = await consultarProduto()
    //se for um array/lista a consulta funcionou

    try {
        if (Array.isArray(resultado)) {
            return {
                "status": true,
                "mensagem": "Produtos recuperados com sucesso",
                "listaDeProdutos": resultado
            }
        }
        else {
            return {
                "status": false,
                "mensagem": "Erro ao recuperar os produtos do Backend",
                "listaDeProdutos": []
            }
        }

    } catch (error) {
        return {
            "status": false,
            "mensagem": "Erro " + error.mensage,
            "listaDeProdutos": []
        }
    }

})
export const inserirProdutoReducer = createAsyncThunk('gravarProduto', async (produto) => {
    //dar previsibilidade ao conteúdo do payload
    //lista de produtos
    console.log(produto)
    const resultado = await gravarProduto(produto)
    //se for um array/lista a consulta funcionou
    console.log(resultado)
    try {
        return {
            "status": resultado.status,
            "mensagem": resultado.mensagem,
            produto,
        }
    }
    catch (erro) {
        return {
            "status": false,
            "mensagem": "Erro: " + erro.message,
        }
    }

})
export const editarProdutoReducer = createAsyncThunk('alterarProduto', async (produto) => {
    //dar previsibilidade ao conteúdo do payload
    //lista de produtos
    console.log(produto)
    const resultado = await alterarProduto(produto)
    //se for um array/lista a consulta funcionou
    console.log(resultado)
    try {
        return {
            "status": resultado.status,
            "mensagem": resultado.mensagem,
            produto,
        }
    }
    catch (erro) {
        return {
            "status": false,
            "mensagem": "Erro: " + erro.message,
        }
    }

})
export const apagarProdutoReducer = createAsyncThunk('excluirProduto', async (produto) => {
    //dar previsibilidade ao conteúdo do payload
    //lista de produtos
    console.log(produto)
    const resultado = await excluirProduto(produto)
    //se for um array/lista a consulta funcionou
    console.log(resultado)
    try {
        return {
            "status": resultado.status,
            "mensagem": resultado.mensagem,
            produto,
        }
    }
    catch (erro) {
        return {
            "status": false,
            "mensagem": "Erro: " + erro.message,
        }
    }
})

const produtoReducer = createSlice({
    name: 'produto',
    initialState: {
        estado: ESTADO.OCIOSO,
        mensagem: "",
        listaDeProdutos: []
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(buscarProdutos.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE
            state.mensagem = "Processando requisição (buscando produtos)"
        })
            .addCase(buscarProdutos.fulfilled, (state, action) => {
                if (action.payload.status) {
                    state.estado = ESTADO.OCIOSO
                    state.mensagem = action.payload.mensagem
                    state.listaDeProdutos = action.payload.listaDeProdutos
                }
                else {
                    state.estado = ESTADO.ERRO
                    state.mensagem = action.payload.mensagem
                    state.listaDeProdutos = action.payload.listaDeProdutos
                }
            })
            .addCase(buscarProdutos.rejected, (state, action) => {
                state.estado = ESTADO.ERRO
                state.mensagem = action.payload.mensagem
                state.listaDeProdutos = action.payload.listaDeProdutos
            })
            .addCase(apagarProdutoReducer.pending, (state, action) => {
                state.estado = ESTADO.PENDENTE
                state.mensagem = "Processando requisição (Excluindo Produto)"
            })
            .addCase(apagarProdutoReducer.fulfilled, (state, action) => {
                if (action.payload.status) {
                    state.estado = ESTADO.OCIOSO
                    state.mensagem = action.payload.mensagem
                    if (action.payload.produto) {
                        state.listaDeProdutos = state.listaDeProdutos.filter((produto) =>
                            produto.codigo !== action.payload.produto.codigo
                        )
                    }
                }
                else {
                    state.estado = ESTADO.ERRO
                    state.mensagem = action.payload.mensagem
                }
                //altera a lista de produtos?
            })
            .addCase(apagarProdutoReducer.rejected, (state, action) => {
                state.estado = ESTADO.ERRO
                state.mensagem = ""//action.payload.mensagem
            })
            .addCase(editarProdutoReducer.pending, (state, action) => {
                state.estado = ESTADO.PENDENTE
                state.mensagem = "Processando requisição (Atualizando produto)"
            })
            .addCase(editarProdutoReducer.fulfilled, (state, action) => {
                if (action.payload.status) {
                    state.estado = ESTADO.OCIOSO
                    state.mensagem = action.payload.mensagem
                    if (action.payload.produto) {
                        const i = state.listaDeProdutos.findIndex((produto) => produto.codigo === action.payload.produto.codigo)
                        state.listaDeProdutos[i] = action.payload.produto
                    }
                }
                else {
                    state.estado = ESTADO.ERRO
                    state.mensagem = action.payload.mensagem
                }
            })
            .addCase(editarProdutoReducer.rejected, (state, action) => {
                state.estado = ESTADO.ERRO
                state.mensagem = action.payload.mensagem
            })
            .addCase(inserirProdutoReducer.pending, (state, action) => {
                state.estado = ESTADO.PENDENTE
                state.mensagem = "Processando requisição (Cadastrando produto)"
            })
            .addCase(inserirProdutoReducer.fulfilled, (state, action) => {
                if (action.payload.status) {
                    state.estado = ESTADO.OCIOSO
                    state.mensagem = action.payload.mensagem
                    if (action.payload.produto) {
                        state.listaDeProdutos.push(action.payload.produto)
                    }
                    else {
                        state.estado = ESTADO.ERRO
                        state.mensagem = action.payload.mensagem
                    }
                }
            })
    }
})

export default produtoReducer.reducer