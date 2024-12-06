import { Button, Spinner, Col, Form, InputGroup, Row } from 'react-bootstrap'
import toast, { Toaster } from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { useDispatch } from "react-redux"
import { editarUsuarioReducer, inserirUsuarioReducer, buscarUsuarios } from '../../../redux/usuarioReducer.js'
import { consultarPrivilegio } from '../../../servicos/servicoPrivilegio.js'

export default function FormCadUsuario(props) {
    const [usuario, setUsuario] = useState(props.usuarioSelecionado)
    const [formValidado, setFormValidado] = useState(false)
    const [privilegios, setPrivilegios] = useState([])
    const [temPrivilegios, setTemPrivilegios] = useState(false)

    const despachante = useDispatch()

    useEffect(() => {
        despachante(buscarUsuarios())
    }, [despachante])

    useEffect(() => {
        consultarPrivilegio()
            .then((resultado) => {
                if (Array.isArray(resultado)) {
                    setPrivilegios(resultado)
                    setTemPrivilegios(true)
                    toast.success("Privilégios carregados com sucesso!")
                } else {
                    toast.error("Não foi possível carregar os privilégios.")
                }
            })
            .catch(() => {
                setTemPrivilegios(false)
                toast.error("Erro ao carregar os privilégios.")
            })
    }, [])

    function selecionarPrivilegio(evento) {
        setUsuario({ ...usuario, privilegio: { codigo: evento.currentTarget.value } })
    }

    function manipularSubmissao(evento) {
        const form = evento.currentTarget
        if (form.checkValidity()) {
            if (!props.modoEdicao) {
                despachante(inserirUsuarioReducer(usuario))
                toast.success("Usuário inserido com sucesso!")
            } else {
                despachante(editarUsuarioReducer(usuario))
                props.setModoEdicao(false)
                toast.success("Usuário alterado com sucesso!")
            }
            props.setModoEdicao(false)
            props.setUsuarioSelecionado({
                codigo: 0,
                nome: "",
                senha: "",
                privilegio: {}
            })
            props.setExibirTabela(true)
        } else {
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
                        type="text"
                        id="codigo"
                        name="codigo"
                        value={usuario.codigo}
                        disabled
                        onChange={manipularMudanca}
                    />
                    <Form.Control.Feedback type="invalid">Por favor, informe o código!</Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-4">
                <Form.Group as={Col} md="12">
                    <Form.Label>Nome:</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        id="nome"
                        name="nome"
                        value={usuario.nome}
                        onChange={manipularMudanca}
                    />
                    <Form.Control.Feedback type="invalid">Por favor, informe o nome!</Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-4">
                <Form.Group as={Col} md="12">
                    <Form.Label>Endereco:</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        id="endereco"
                        name="endereco"
                        value={usuario.endereco}
                        onChange={manipularMudanca}
                    />
                    <Form.Control.Feedback type="invalid">Por favor, informe o endereco!</Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-4">
                <Form.Group as={Col} md="12">
                    <Form.Label>Telefone:</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        id="telefone"
                        name="telefone"
                        value={usuario.telefone}
                        onChange={manipularMudanca}
                    />
                    <Form.Control.Feedback type="invalid">Por favor, informe o telefone!</Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-4">
                <Form.Group as={Col} md="12">
                    <Form.Label>Senha:</Form.Label>
                    <InputGroup hasValidation>
                        <Form.Control
                            type="password"
                            id="senha"
                            name="senha"
                            value={usuario.senha}
                            onChange={manipularMudanca}
                            required
                        />
                        <Form.Control.Feedback type="invalid">Por favor, informe a senha!</Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
            </Row>
            <Row className="mb-4">
                <Form.Group as={Col} md="7">
                    <Form.Label>Privilégio:</Form.Label>
                    <Form.Select id="privilegio" name="privilegio" onChange={selecionarPrivilegio}>
                        <option value="">Selecione um privilégio</option>
                        {privilegios.map((privilegio) => (
                            <option key={privilegio.codigo} value={privilegio.codigo}>
                                {privilegio.descricao}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="1">
                    {
                        !temPrivilegios ? <Spinner className="mt-4" animation="border" variant="success" /> : ""
                    }
                </Form.Group>
            </Row>
            <Row className="mt-2 mb-2">
                <Col md={1}>
                    <Button type="submit">{props.modoEdicao ? "Alterar" : "Confirmar"}</Button>
                </Col>
                <Col md={{ offset: 1 }}>
                    <Button onClick={() => {
                        props.setUsuarioSelecionado({
                            codigo: 0,
                            nome: "",
                            senha: "",
                            privilegio: {}
                        })
                        props.setExibirTabela(true)
                    }}>Voltar</Button>
                </Col>
            </Row>
            <Toaster position="top-right" />
        </Form>
    )
}