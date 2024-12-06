import { Alert, Button, Container, Spinner, Table } from "react-bootstrap"
import toast, { Toaster } from "react-hot-toast"

// redux
import { useSelector, useDispatch } from "react-redux"
import { buscarProdutos, apagarProdutoReducer } from "../../../redux/produtoReducer"
import ESTADO from "../../../redux/estados"
import { useEffect } from "react"

export default function TabelaProdutos(props) {
    const { estado, mensagem, listaDeProdutos } = useSelector(state => state.produto)
    const despachante = useDispatch()

    useEffect(() => {
        despachante(buscarProdutos())
    }, [despachante])

    function editarProduto(produto) {
        props.setModoEdicao(true)
        props.setProdutoSelecionado(produto)
        props.setExibirTabela(false)
    }

    function excluirProdutoSelecionado(produto) {
        if (window.confirm("Deseja realmente excluir o produto " + produto.descricao)) {
            despachante(apagarProdutoReducer(produto))
            toast.success("Produto Apagado!")
        }
    }

    if (estado === ESTADO.PENDENTE) {
        return (
            <div>
                <Spinner animation="border" role="status"></Spinner>
                <Alert variant="primary">{mensagem}</Alert>
            </div>
        )
    }
    else if (estado === ESTADO.ERRO) {
        <div>
            <Alert variant="danger">{mensagem}</Alert>
        </div>
    }
    else if (ESTADO.OCIOSO) {
        return (
            <>
                <Container>
                    <Button className="mb-3" variant="primary"
                        onClick={() => {
                            props.setExibirTabela(false)
                        }}>
                        Adicionar
                    </Button>
                    <Table striped bordered hover>
                        <thead>
                            <th>Código</th>
                            <th>Descrição</th>
                            <th>Preço de custo</th>
                            <th>Preço de venda</th>
                            <th>Qtd. em estoque</th>
                            <th>Imagem</th>
                            <th>Validade</th>
                            <th>Categoria</th>
                            <th>Fornecedor</th>
                            <th>Ações</th>
                        </thead>
                        <tbody>
                            {
                                listaDeProdutos?.map((produto) => {
                                    return (
                                        <tr>
                                            <td>{produto.codigo}</td>
                                            <td>{produto.descricao}</td>
                                            <td>{produto.precoCusto}</td>
                                            <td>{produto.precoVenda}</td>
                                            <td>{produto.qtdEstoque}</td>
                                            <td><img style={{
                                                "width": "40px",
                                                "height": "40px"
                                            }} src={produto.urlImagem} alt="foto do produto" /></td>
                                            <td>{produto.dataValidade}</td>
                                            <td>{produto.categoria.descricao}</td>
                                            <td>{produto.fornecedor.nome}</td>
                                            <td>
                                                <Button onClick={() => {
                                                    editarProduto(produto)
                                                }} variant="warning">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                                    </svg>
                                                </Button> <Button onClick={() => {
                                                    excluirProdutoSelecionado(produto)
                                                }} variant="danger">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                                    </svg>
                                                </Button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                    <p>Quatidade de produtos cadastrados: {listaDeProdutos.length}</p>
                    <Toaster position="top-right" />
                </Container>
            </>
        )
    }
}