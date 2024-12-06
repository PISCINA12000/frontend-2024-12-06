import { Container, Form, Button} from "react-bootstrap"
import { useContext, useRef, useEffect, useState } from "react"
import { ContextoUsuario } from "../../App"
import { consultarUsuario } from "../../servicos/servicoUsuario"
import toast, {Toaster} from 'react-hot-toast'

export default function TelaLogin(){
    const nomeUsuario = useRef()
    const senha = useRef()
    const {usuario, setUsuario} = useContext(ContextoUsuario)
    const [usuariosCadastrados, setUsuariosCadastrados] = useState([])
    useEffect(()=>{
        consultarUsuario().then((resultado)=>{
            if (Array.isArray(resultado)){
                setUsuariosCadastrados(resultado)
                toast.success("Usuarios Carregados com Sucesso!")
            }
            else{
                toast.error("Não foi possível carregar os usuarios")
            }
        }).catch((erro)=>{
            toast.error("Não foi possível carregar os usuarios")
        })
    },[])

    function manipularSubmissao(evento){
        const usuarioDigitado = nomeUsuario.current.value
        const senhaDigitada = senha.current.value
        if (senhaDigitada === "admin" && usuarioDigitado === "admin")
        {
            setUsuario({
                "usuario": usuarioDigitado,
                "previlegio": "Gerente",
                "logado": true
            })
        }
        else
        {
            var i = 0
            console.log(usuariosCadastrados)
            while (i < usuariosCadastrados.length && usuariosCadastrados[i].nome != usuarioDigitado)
                i++
            if (i < usuariosCadastrados.length)
            {
                if (usuariosCadastrados[i].senha === senhaDigitada)
                {
                    setUsuario({
                        "usuario": usuariosCadastrados[i].nome,
                        "previlegio": usuariosCadastrados[i].privilegio.descricao,
                        "logado":true
                    })
                }
                else{
                    toast.error("Senha Incorreta")
                }
            }
            else{
                toast.error("Usuario Incorreto")
            }
        }
        evento.preventDefault()
        evento.stopPropagation()
    }
    return(
        <Container className="w-25 border p-2">
            <Form onSubmit = {manipularSubmissao}>
                <Form.Group
                 className="mb-3"
                 controlId="formBasicEmail">
                    <Form.Label>Usuario</Form.Label>
                    <Form.Control  
                        type="text" 
                        placeholder="Informe o usuário"
                        id = "usuario"
                        name = "usuario"
                        ref = {nomeUsuario} // nomeUsario se refere à usuario
                    />
                    <Form.Text className="text-muted">
                    Nunca compartilha suas credenciais.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Senha</Form.Label>
                    <Form.Control 
                        type = "password" 
                        placeholder = "Password" 
                        id = "senha"
                        name = "senha"
                        ref = {senha}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Login
                </Button>
                <Toaster position="top-right"/>
            </Form>
        </Container>
    )
}