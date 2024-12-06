import { Button, Spinner, Col, Form, InputGroup, Row } from 'react-bootstrap'
import toast, { Toaster } from 'react-hot-toast'
// redux
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { editarUsuarioReducer, inserirUsuarioReducer, buscarUsuarios } from '../../../redux/usuarioReducer'

export default function FormCadUsuario(props) {
    const [usuario, setUsuario] = useState(props.usuarioSelecionado)
    const [formValidado, setFormValidado] = useState(false)

    const despachante = useDispatch()

    useEffect(() => {
        despachante(buscarUsuarios())
    }, [despachante])

    function manipularSubmissao(evento) {
        const form = evento.currentTarget
        if (form.checkValidity()) {

            if (!props.modoEdicao) {
                //cadastrar o produto
                despachante(inserirUsuarioReducer(usuario))
                toast.success("Usuario Inserido!")
            }
            else {
                despachante(editarUsuarioReducer(usuario))
                props.setModoEdicao(false)
                toast.success("Usuario Alterado!")
            }
            props.setModoEdicao(false)
            props.setUsuarioSelecionado({
                codigo: 0,
                nome: "",
                senha: "",
                previlegio: {}
            })
            props.setExibirTabela(true)
        }
        else {
            setFormValidado(true)
        }
        evento.preventDefault()
        evento.stopPropagation()
    }

    function manipularMudanca(evento) {
        const elemento = evento.target.name
        const valor = evento.target.value
        setUsuario({ ...usuario, [elemento]: valor })
    }

    return (
        <Form noValidate validated={formValidado} onSubmit={manipularSubmissao}>
            <Row className="mb-4">
                <Form.Group as={Col} md="4">
                    <Form.Label>Código:</Form.Label>
                    <Form.Control
                        required
                        type = "text"
                        id = "codigo"
                        name = "codigo"
                        value = {usuario.codigo}
                        disabled
                        onChange = {manipularMudanca}
                    />
                    <Form.Control.Feedback type='invalid'>Por favor, informe o código!</Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-4">
                <Form.Group as={Col} md="12">
                    <Form.Label>Nome:</Form.Label>
                    <Form.Control
                        required
                        type = "text"
                        id = "nome"
                        name = "nome"
                        value = {usuario.nome}
                        onChange = {manipularMudanca}
                    />
                    <Form.Control.Feedback type="invalid">Por favor, informe o nome!</Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-4">
                <Form.Group as={Col} md="4">
                    <Form.Label>Endereco:</Form.Label>
                    <Form.Control
                        required
                        type = "text"
                        id = "endereco"
                        name = "endereco"
                        value = {usuario.endereco}
                        disabled
                        onChange = {manipularMudanca}
                    />
                    <Form.Control.Feedback type='invalid'>Por favor, informe o endereço!</Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-4">
                <Form.Group as={Col} md="4">
                    <Form.Label>Telefone:</Form.Label>
                    <Form.Control
                        required
                        type = "text"
                        id = "telefone"
                        name = "telefone"
                        value = {usuario.telefone}
                        disabled
                        onChange = {manipularMudanca}
                    />
                    <Form.Control.Feedback type='invalid'>Por favor, informe o telefone!</Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-4">
                <Form.Group as={Col} md="4">
                    <Form.Label>Senha:</Form.Label>
                    <InputGroup hasValidation>
                        <Form.Control
                            type = "password"
                            id = "senha"
                            name = "senha"
                            aria-describedby = "senha"
                            value = {usuario.senha}
                            onChange = {manipularMudanca}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor, informe a senha!
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="4">
                    <Form.Label>Privilegio:</Form.Label>
                    <InputGroup hasValidation>
                        <Form.Control
                            type = "text"
                            id = "previlegio"
                            name = "previlegio"
                            aria-describedby = "previlegio"
                            value = {usuario.privilegio.descricao}
                            onChange = {manipularMudanca}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor, informe o privilegio!
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
            </Row>
            <Row className='mt-2 mb-2'>
                <Col md={1}>
                    <Button type="submit">
                        {
                            props.modoEdicao ?
                                "Alterar" :
                                "Confirmar"
                        }
                    </Button>
                </Col>
                <Col md={{ offset: 1 }}>
                    <Button
                        onClick={() => {
                            props.setUsuarioSelecionado({
                                codigo: 0,
                                nome: "",
                                senha: "",
                                previlegio: {}
                            })
                            props.setExibirTabela(true)
                        }}>Voltar
                    </Button>
                </Col>
            </Row>
            <Toaster position="top-right" />
        </Form>
    )
}