import Menu from "./Menu"
import Cabecalho from "./Cabecalho"
import { Container } from "react-bootstrap"

export default function Pagina(props) {
    return (
        <>
            <Container>
                <Cabecalho titulo="Sistema de Controle Gerencial" />
                <Menu />
                {
                    props.children
                }
            </Container>
        </>
    )
}