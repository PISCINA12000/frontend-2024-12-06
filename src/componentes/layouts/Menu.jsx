import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { Link } from 'react-router-dom'
import { useContext } from "react"
import { ContextoUsuario } from '../../App'

export default function Menu(props) {
    const { usuario, setUsuario } = useContext(ContextoUsuario)

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand as={Link} to="/">Menu</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavDropdown title="Cadastros" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/cliente">Clientes</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/fornecedor">Fornecedores</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/produto">Produtos</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/categoria">Categorias</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/usuario">Usuarios</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/privilegio">Privilegios</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Operações" id="basic-nav-dropdown">
                            <NavDropdown.Item>Compra</NavDropdown.Item>
                            <NavDropdown.Item>Venda</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Relatórios" id="basic-nav-dropdown">
                            <NavDropdown.Item>Estoque</NavDropdown.Item>
                            <NavDropdown.Item>Vendas</NavDropdown.Item>
                            <NavDropdown.Item>Compras</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link as={Link} to="/sobre">Sobre</Nav.Link>
                        <Nav.Link
                            onClick={() => {
                                setUsuario({
                                    "usuario": "",
                                    "logado": false
                                })
                            }}
                        >
                            Sair
                        </Nav.Link>
                    </Nav>
                    <Nav className="ms-auto">
                        <Nav.Link>Usuário Logado: {usuario.nome}</Nav.Link>
                        <Nav.Link>Privilégio: {usuario.previlegio}</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
