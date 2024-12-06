import { Button, Spinner, Col, Form, InputGroup, Row } from 'react-bootstrap'
import { consultarCategoria } from '../../../servicos/servicoCategoria'
import { consultarFornecedor } from '../../../servicos/servicoFornecedor'

import toast, { Toaster } from 'react-hot-toast'
// redux
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { editarProdutoReducer, inserirProdutoReducer, buscarProdutos } from '../../../redux/produtoReducer'


export default function FormCadProdutos(props) {
    const [produto, setProduto] = useState(props.produtoSelecionado)
    const [formValidado, setFormValidado] = useState(false)
    const [categorias, setCategorias] = useState([])
    const [temCategorias, setTemCategorias] = useState(false)
    const [fornecedor, setFornecedor] = useState([])
    const [temFornecedor, setTemFornecedor] = useState(false)
    const despachante = useDispatch()

    useEffect(() => {
        despachante(buscarProdutos())
    }, [despachante])

    useEffect(() => {
        consultarCategoria().then((resultado) => {
            if (Array.isArray(resultado)) {
                setCategorias(resultado)
                setTemCategorias(true)
                toast.success("Categorias Carregadas com Sucesso!")
            }
            else {
                toast.error("Não foi possível carregar as categorias")
            }
        }).catch((erro) => {
            setTemCategorias(false)
            toast.error("Não foi possível carregar as categorias")
        })

    }, []) //didMount
    function selecionarCategoria(evento) {
        setProduto({ ...produto, categoria: { codigo: evento.currentTarget.value } })
    }

    useEffect(() => {
        consultarFornecedor().then((resultado) => {
            if (Array.isArray(resultado)) {
                setFornecedor(resultado)
                setTemFornecedor(true)
                toast.success("Fornecedores Carregados com Sucesso!")
            }
            else {
                toast.error("Não foi possível carregar os fornecedores")
            }
        }).catch((erro) => {
            setTemFornecedor(false)
            toast.error("Não foi possível carregar os fornecedores")
        })
    }, []) //didMount
    function selecionarFornecedor(evento) {
        setProduto({ ...produto, fornecedor: { codigo: evento.currentTarget.value } })

    }
    function manipularSubmissao(evento) {
        const form = evento.currentTarget
        if (form.checkValidity()) {

            if (!props.modoEdicao) {
                //cadastrar o produto
                despachante(inserirProdutoReducer(produto))
                toast.success("Produto Inserido!")
            }
            else {
                despachante(editarProdutoReducer(produto))
                props.setModoEdicao(false)
                toast.success("Produto Alterado!")
            }
            props.setModoEdicao(false)
            props.setProdutoSelecionado({
                codigo: 0,
                descricao: "",
                precoCusto: 0,
                precoVenda: 0,
                qtdEstoque: 0,
                urlImagem: "",
                dataValidade: "",
                categoria: {},
                fornecedor: {}
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
        setProduto({ ...produto, [elemento]: valor })
    }

    return (
        <Form noValidate validated={formValidado} onSubmit={manipularSubmissao}>
            <Row className="mb-4">
                <Form.Group as={Col} md="4">
                    <Form.Label>Código</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        id="codigo"
                        name="codigo"
                        value={produto.codigo}
                        disabled
                        onChange={manipularMudanca}
                    />
                    <Form.Control.Feedback type='invalid'>Por favor, informe o código do produto!</Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-4">
                <Form.Group as={Col} md="12">
                    <Form.Label>Descrição</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        id="descricao"
                        name="descricao"
                        value={produto.descricao}
                        onChange={manipularMudanca}
                    />
                    <Form.Control.Feedback type="invalid">Por favor, informe a descrição do produto!</Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-4">
                <Form.Group as={Col} md="4">
                    <Form.Label>Preço de Custo:</Form.Label>
                    <InputGroup hasValidation>
                        <InputGroup.Text id="precoCusto">R$</InputGroup.Text>
                        <Form.Control
                            type="number"
                            id="precoCusto"
                            name="precoCusto"
                            aria-describedby="precoCusto"
                            value={produto.precoCusto}
                            onChange={manipularMudanca}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor, informe o preço de custo!
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="4">
                    <Form.Label>Preço de Venda:</Form.Label>
                    <InputGroup hasValidation>
                        <InputGroup.Text id="precoVenda">R$</InputGroup.Text>
                        <Form.Control
                            type="number"
                            id="precoVenda"
                            name="precoVenda"
                            aria-describedby="precoVenda"
                            value={produto.precoVenda}
                            onChange={manipularMudanca}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor, informe o preço de venda!
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="4">
                    <Form.Label>Qtd em estoque:</Form.Label>
                    <InputGroup hasValidation>
                        <InputGroup.Text id="qtdEstoque">+</InputGroup.Text>
                        <Form.Control
                            type="number"
                            id="qtdEstoque"
                            name="qtdEstoque"
                            aria-describedby="qtdEstoque"
                            value={produto.qtdEstoque}
                            onChange={manipularMudanca}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor, informe a quantidade em estoque!
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
            </Row>
            <Row className="mb-4">
                <Form.Group as={Col} md="12">
                    <Form.Label>Url da imagem:</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        id="urlImagem"
                        name="urlImagem"
                        value={produto.urlImagem}
                        onChange={manipularMudanca}
                    />
                    <Form.Control.Feedback type="invalid">Por favor, informe a url da imagem do produto!</Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-4">
                <Form.Group as={Col} md="4">
                    <Form.Label>Válido até:</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        id="dataValidade"
                        name="dataValidade"
                        value={produto.dataValidade}
                        onChange={manipularMudanca}
                    />
                    <Form.Control.Feedback type="invalid">Por favor, informe a data de validade do produto!</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md={7}>
                    <Form.Label>Categoria:</Form.Label>
                    <Form.Select id='categoria' name='categoria' onChange={selecionarCategoria}>
                        <option value="">Selecione uma categoria</option>
                        {categorias.map((categoria) => (
                            <option key={categoria.codigo} value={categoria.codigo}>
                                {categoria.descricao}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md={1}>
                    {
                        !temCategorias ? <Spinner className='mt-4' animation="border" variant="success" />
                            : ""
                    }
                </Form.Group>
            </Row>
            <Row className="mb-4">
                <Form.Group as={Col} md={7}>
                    <Form.Label>Fornecedor:</Form.Label>
                    <Form.Select id='fornecedor' name='fornecedor' onChange={selecionarFornecedor}>
                        <option value="">Selecione um fornecedor</option>
                        {fornecedor.map((fornecedor) => (
                            <option key={fornecedor.codigo} value={fornecedor.codigo}>
                                {fornecedor.nome}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md={1}>
                    {
                        !temFornecedor ?
                            <Spinner className='mt-4' animation="border" variant="success" />
                            :
                            ""
                    }
                </Form.Group>
            </Row>
            <Row className='mt-2 mb-2'>
                <Col md={1}>
                    <Button type="submit" disabled={!temCategorias}>{props.modoEdicao ? "Alterar" : "Confirmar"}</Button>
                </Col>
                <Col md={{ offset: 1 }}>
                    <Button onClick={() => {
                        props.setProdutoSelecionado({
                            codigo: 0,
                            descricao: "",
                            precoCusto: 0,
                            precoVenda: 0,
                            qtdEstoque: 0,
                            urlImagem: "",
                            dataValidade: "",
                            categoria: {},
                            fornecedor: {}
                        })
                        props.setExibirTabela(true)
                    }}>Voltar</Button>
                </Col>
            </Row>
            <Toaster position="top-right" />
        </Form>
    )
}