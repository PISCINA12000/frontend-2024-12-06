import { createSlice } from "@reduxjs/toolkit"
import { createAsyncThunk } from "@reduxjs/toolkit"
import { consultarPrivilegio, excluirPrivilegio, gravarPrivilegio, alterarPrivilegio } from "../servicos/servicoPrivilegio"
import ESTADO from "./estados"

// Funções Assíncronas
export const buscarPrivilegio = createAsyncThunk('buscarPrivilegio', async () => {
    try {
        const resultado = await consultarPrivilegio()
        if (Array.isArray(resultado)) {
            return {
                "status": true,
                "mensagem": "Privilégios recuperados com sucesso",
                "listaDePrivilegios": resultado
            }
        } else {
            return {
                "status": false,
                "mensagem": "Erro ao recuperar os privilégios do backend.",
                "listaDePrivilegios": []
            }
        }
    } catch (erro) {
        return {
            "status": false,
            "mensagem": erro.message || "Erro inesperado ao recuperar privilégios.",
            "listaDePrivilegios": []
        }
    }
})

export const apagarPrivilegio = createAsyncThunk('apagarPrivilegio', async (privilegio) => {
    try {
        const resultado = await excluirPrivilegio(privilegio)
        return {
            "status": resultado.status,
            "mensagem": resultado.mensagem || "Privilégio excluído com sucesso.",
            "codigo": privilegio.codigo
        }
    } catch (erro) {
        return {
            "status": false,
            "mensagem": erro.message || "Erro inesperado ao excluir privilégio."
        }
    }
})

export const incluirPrivilegio = createAsyncThunk('incluirPrivilegio', async (privilegio) => {
    try {
        const resultado = await gravarPrivilegio(privilegio)
        if (resultado.status) {
            privilegio.codigo = resultado.codigo
            return {
                "status": true,
                "mensagem": resultado.mensagem || "Privilégio incluído com sucesso.",
                "privilegio": privilegio
            }
        } else {
            return {
                "status": false,
                "mensagem": resultado.mensagem || "Erro ao incluir privilégio."
            }
        }
    } catch (erro) {
        return {
            "status": false,
            "mensagem": erro.message || "Erro inesperado ao incluir privilégio."
        }
    }
})

export const atualizarPrivilegio = createAsyncThunk('atualizarPrivilegio', async (privilegio) => {
    try {
        const resultado = await alterarPrivilegio(privilegio)
        return {
            "status": resultado.status,
            "mensagem": resultado.mensagem || "Privilégio atualizado com sucesso.",
            "privilegio": { ...privilegio, codigo: resultado.codigo }
        }
    } catch (erro) {
        return {
            "status": false,
            "mensagem": erro.message || "Erro inesperado ao atualizar privilégio."
        }
    }
})

// Slice do Redux
const privilegioReducer = createSlice({
    name: 'privilegio',
    initialState: {
        estado: ESTADO.OCIOSO,
        mensagem: "",
        listaDePrivilegios: []
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(buscarPrivilegio.pending, (state) => {
                state.estado = ESTADO.PENDENTE
                state.mensagem = "Processando requisição (buscando privilégios)"
            })
            .addCase(buscarPrivilegio.fulfilled, (state, action) => {
                state.estado = action.payload.status ? ESTADO.OCIOSO : ESTADO.ERRO
                state.mensagem = action.payload.mensagem
                state.listaDePrivilegios = action.payload.listaDePrivilegios
            })
            .addCase(buscarPrivilegio.rejected, (state, action) => {
                state.estado = ESTADO.ERRO
                state.mensagem = action.error?.message || "Erro inesperado ao buscar privilégios."
                state.listaDePrivilegios = []
            })
            .addCase(apagarPrivilegio.pending, (state) => {
                state.estado = ESTADO.PENDENTE
                state.mensagem = "Processando requisição (excluindo privilégio)"
            })
            .addCase(apagarPrivilegio.fulfilled, (state, action) => {
                state.estado = action.payload.status ? ESTADO.OCIOSO : ESTADO.ERRO
                state.mensagem = action.payload.mensagem
                if (action.payload.status) {
                    state.listaDePrivilegios = state.listaDePrivilegios.filter(
                        (item) => item.codigo !== action.payload.codigo
                    )
                }
            })
            .addCase(apagarPrivilegio.rejected, (state, action) => {
                state.estado = ESTADO.ERRO
                state.mensagem = action.error?.message || "Erro inesperado ao excluir privilégio."
            })
            .addCase(incluirPrivilegio.pending, (state) => {
                state.estado = ESTADO.PENDENTE
                state.mensagem = "Processando requisição (incluir privilégio)"
            })
            .addCase(incluirPrivilegio.fulfilled, (state, action) => {
                state.estado = action.payload.status ? ESTADO.OCIOSO : ESTADO.ERRO
                state.mensagem = action.payload.mensagem
                if (action.payload.status) {
                    state.listaDePrivilegios.push(action.payload.privilegio)
                }
            })
            .addCase(incluirPrivilegio.rejected, (state, action) => {
                state.estado = ESTADO.ERRO
                state.mensagem = action.error?.message || "Erro inesperado ao incluir privilégio."
            })
            .addCase(atualizarPrivilegio.pending, (state) => {
                state.estado = ESTADO.PENDENTE
                state.mensagem = "Processando requisição (atualizar privilégio)"
            })
            .addCase(atualizarPrivilegio.fulfilled, (state, action) => {
                state.estado = action.payload.status ? ESTADO.OCIOSO : ESTADO.ERRO
                state.mensagem = action.payload.mensagem
                if (action.payload.status) {
                    state.listaDePrivilegios = state.listaDePrivilegios.map((item) =>
                        item.codigo === action.payload.privilegio.codigo ? action.payload.privilegio : item
                    )
                }
            })
            .addCase(atualizarPrivilegio.rejected, (state, action) => {
                state.estado = ESTADO.ERRO
                state.mensagem = action.error?.message || "Erro inesperado ao atualizar privilégio."
            })
    }
})

export default privilegioReducer.reducer
