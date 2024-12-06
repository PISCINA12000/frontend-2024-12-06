import { createSlice } from "@reduxjs/toolkit"
import { createAsyncThunk } from "@reduxjs/toolkit"
import { alterarUsuario, consultarUsuario, excluirUsuario, gravarUsuario} from "../servicos/servicoUsuario"

import ESTADO from "./estados"
import { act } from "react"

export const buscarUsuarios =  createAsyncThunk('buscarUsuarios', async() =>{
    //lista de produtos
    const resultado = await consultarUsuario()
    //se for um array/lista a consulta funcionou
    
    try {
        if(Array.isArray(resultado)){
            return{
                "status":true,
                "mensagem":"Usuarios recuperados com sucesso",
                "listaDeUsuarios":resultado
            }
        }
        else{
            return{
                "status":false,
                "mensagem":"Erro ao recuperar os usuarios do Backend",
                "listaDeUsuarios":[]
            }
        }

    } catch (error) {
        return {
            "status":false,
            "mensagem":"Erro "+error.mensage,
            "listaDeUsuarios":[]
        }
    }
        
})
export const inserirUsuarioReducer = createAsyncThunk('gravarUsuario', async(usuario)=>{
    //dar previsibilidade ao conteúdo do payload
        //lista de produtos
        console.log(usuario)
        const resultado = await gravarUsuario(usuario)
        //se for um array/lista a consulta funcionou
        console.log(resultado)
        try {
                return {
                    "status":resultado.status,
                    "mensagem":resultado.mensagem,
                    usuario,
                }
        }
        catch(erro){
            return {
                "status":false,
                "mensagem":"Erro: " + erro.message,
            }
        } 

})
export const editarUsuarioReducer = createAsyncThunk('alterarUsuario', async(usuario)=>{
    //dar previsibilidade ao conteúdo do payload
        //lista de produtos
        console.log(usuario)
        const resultado = await alterarUsuario(usuario)
        //se for um array/lista a consulta funcionou
        console.log(resultado)
        try {
                return {
                    "status":resultado.status,
                    "mensagem":resultado.mensagem,
                    usuario,
                }
        }
        catch(erro){
            return {
                "status":false,
                "mensagem":"Erro: " + erro.message,
            }
        } 

})
export const apagarUsuarioReducer = createAsyncThunk('excluirUsuario', async (usuario)=>{
    //dar previsibilidade ao conteúdo do payload
        //lista de produtos
        console.log(usuario)
        const resultado = await excluirUsuario(usuario)
        //se for um array/lista a consulta funcionou
        console.log(resultado)
        try {
                return {
                    "status":resultado.status,
                    "mensagem":resultado.mensagem,
                    usuario,
                }
        }
        catch(erro){
            return {
                "status":false,
                "mensagem":"Erro: " + erro.message,
            }
        } 
})

const usuarioReducer = createSlice({
    name:'usuario',
    initialState:{
        estado: ESTADO.OCIOSO,
        mensagem:"",
        listaDeUsuarios:[]
    },
    reducers:{},
    extraReducers:(builder)=> {
        builder.addCase(buscarUsuarios.pending, (state, action) =>{
            state.estado=ESTADO.PENDENTE
            state.mensagem="Processando requisição (buscando usuarios)"
        })
        .addCase(buscarUsuarios.fulfilled, (state, action) =>{
          if (action.payload.status){
            state.estado=ESTADO.OCIOSO
            state.mensagem=action.payload.mensagem
            state.listaDeUsuarios=action.payload.listaDeUsuarios
          } 
          else{
            state.estado=ESTADO.ERRO
            state.mensagem = action.payload.mensagem
            state.listaDeUsuarios=action.payload.listaDeUsuarios
          } 
        })
        .addCase(buscarUsuarios.rejected, (state, action) =>{
            state.estado=ESTADO.ERRO
            state.mensagem = action.payload.mensagem
            state.listaDeUsuarios=action.payload.listaDeUsuarios
        })
        .addCase(apagarUsuarioReducer.pending, (state,action) =>{
            state.estado=ESTADO.PENDENTE
            state.mensagem= "Processando requisição (Excluindo usuario)"
        })
        .addCase(apagarUsuarioReducer.fulfilled,(state,action) =>{
            if (action.payload.status){
                state.estado=ESTADO.OCIOSO
                state.mensagem=action.payload.mensagem
                if (action.payload.usuario){
                    state.listaDeUsuarios = state.listaDeUsuarios.filter((usuario)=>
                        usuario.codigo !== action.payload.usuario.codigo
                    )
                }
                
            }
            else{
                state.estado = ESTADO.ERRO
                state.mensagem = action.payload.mensagem
            }
            
            //altera a lista de produtos?
        })
        .addCase(apagarUsuarioReducer.rejected,(state,action)=>{
            state.estado=ESTADO.ERRO
            state.mensagem=""//action.payload.mensagem
        })
        .addCase(editarUsuarioReducer.pending, (state, action) =>{
            state.estado=ESTADO.PENDENTE
            state.mensagem="Processando requisição (Atualizando usuario)"
        })
        .addCase(editarUsuarioReducer.fulfilled,(state,action) =>{
            if(action.payload.status){
                state.estado = ESTADO.OCIOSO
                state.mensagem = action.payload.mensagem
                if (action.payload.usuario){
                    const i = state.listaDeUsuarios.findIndex((usuario) => usuario.codigo === action.payload.usuario.codigo)
                    state.listaDeUsuarios[i] = action.payload.usuario
                }
                
            }
            else{
                state.estado = ESTADO.ERRO
                state.mensagem = action.payload.mensagem
            }
           
        })
        .addCase(editarUsuarioReducer.rejected,(state,action)=>{
            state.estado=ESTADO.ERRO
            state.mensagem= action.payload.mensagem
        })
        .addCase(inserirUsuarioReducer.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE
            state.mensagem = "Processando requisição (Cadastrando usuario)"
        })
        .addCase(inserirUsuarioReducer.fulfilled, (state,action)=>{
            if(action.payload.status){
                state.estado = ESTADO.OCIOSO
                state.mensagem = action.payload.mensagem
                if (action.payload.usuario)
                {
                    state.listaDeUsuarios.push(action.payload.usuario)
                }
                else
                {
                    state.estado = ESTADO.ERRO
                    state.mensagem = action.payload.mensagem
                }
            }
        })
    }   
})

export default usuarioReducer.reducer