import { useContext } from "react"
import { GrayEmptyBookIcon } from "../../../components/icons"
import { ViewContext } from "../../../contexts/ViewContext"

export function EmptyPage() {
  const { handleAddWord } = useContext(ViewContext)
  return (
    <div className="empty">
      <GrayEmptyBookIcon />

      <div className="empty-text">
        Você ainda não cadastrou nenhuma palavra. Que tal começar agora?
      </div>

      <button onClick={handleAddWord}>Cadastrar Palavra</button>
    </div>
  )
}
