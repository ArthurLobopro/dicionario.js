import { useContext } from "react"
import { NotFoundIcon } from "../../../components/icons"
import { ViewContext } from "../../../contexts/ViewContext"

export function EmptySearch() {
  const { search } = useContext(ViewContext)
  return (
    <div className="empty">
      <div>
        <NotFoundIcon />
      </div>
      A pesquisa "{search}" não encontrou nenhum resultado.
    </div>
  )
}
