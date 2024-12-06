import { Alert } from "react-bootstrap"
import FormCadPrivilegio from "./Formularios/FormCadPrivilegio"
import Pagina from "../layouts/Pagina"
import TabelaPrivilegio from "./Tabelas/TabelaPrivilegio"
import { useState } from "react"

export default function TelaCadastroPrivilegio(props) {
    const [exibirTabela, setExibirTabela] = useState(true)
    const [modoEdicao, setModoEdicao] = useState(false)
    const [privilegioSelecionada, setPrivilegioSelecionada] = useState({
        codigo: 0,
        descricao: "",
    })

    return (
        <div>
            <Pagina>
                |<Alert className="mt-02 mb-02 success text-center" variant="success">
                    <h2>
                        Cadastro de Privilegio
                    </h2>
                </Alert>
                {
                    exibirTabela ?
                        <TabelaPrivilegio 
                            setExibirTabela={setExibirTabela}
                            setModoEdicao={setModoEdicao}
                            setPrivilegioSelecionada={setPrivilegioSelecionada}
                        /> :
                        <FormCadPrivilegio
                            setExibirTabela={setExibirTabela}
                            privilegioSelecionada={privilegioSelecionada}
                            setPrivilegioSelecionada={setPrivilegioSelecionada}
                            modoEdicao={modoEdicao}
                            setModoEdicao={setModoEdicao} />
                }
            </Pagina>
        </div>
    )
}