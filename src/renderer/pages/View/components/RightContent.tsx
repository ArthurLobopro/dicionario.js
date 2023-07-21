import { useContext, useMemo, useState } from "react"
import { CircleButton, If } from "../../../components/base"
import { AddIcon, InfoIcon, SearchIcon } from "../../../components/icons"
import { DictionaryInfoModal } from "../../../components/modals/dictionary"
import { ViewContext } from "../../../contexts/ViewContext"
import { InputChangeEvent, InputFocusEvent } from "../../../types"

export function RightContent() {
  const { handleAddWord, search, setSearch, modal, dictionary, words } =
    useContext(ViewContext)

  const [inputVisibility, setInputVisibility] = useState(false)

  function showInfo() {
    modal.open(
      <DictionaryInfoModal dictionary={dictionary} onClose={modal.close} />,
    )
  }

  const search_input = useMemo(() => {
    const handle_change = (e: InputChangeEvent) => setSearch(e?.target.value)

    const handle_blur = (e: InputFocusEvent) => {
      e?.target.value === "" && setInputVisibility(false)
    }

    return (
      <input
        type="search"
        className="simple"
        placeholder="Pesquisar"
        onChange={handle_change}
        onBlur={handle_blur}
        value={search}
        autoFocus
      />
    )
  }, [search])

  return (
    <div className="flex gap-4">
      <div className="flex align-center">
        <If condition={words.length > 0}>
          <If condition={!inputVisibility} else={search_input}>
            <CircleButton
              title="Mostrar barra de pesquisa"
              onClick={() => setInputVisibility(true)}
            >
              <SearchIcon />
            </CircleButton>
          </If>
        </If>
      </div>

      <CircleButton onClick={showInfo} title="Informações do dicionário">
        <InfoIcon />
      </CircleButton>

      <CircleButton onClick={handleAddWord} title="Adicionar palavra">
        <AddIcon className="add-button" />
      </CircleButton>
    </div>
  )
}
