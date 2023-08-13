import { hoverFocus } from "../../../Util"
import { LineTitle } from "../../../components/base"
import { AddIcon, DonwloadIcon } from "../../../components/icons"
import { useModal } from "../../../hooks/useModal"

import {
  AddDictionaryModal,
  ImportDictionaryModal,
} from "../../../components/modals/dictionary"

interface DictionarySectionsProps {
  modal: ReturnType<typeof useModal>
}

export function DictionarySection(props: DictionarySectionsProps) {
  const { modal } = props

  function HandleAddDictionary() {
    modal.open(<AddDictionaryModal onClose={modal.close} />)
  }

  function HandleImportDictionary() {
    modal.open(<ImportDictionaryModal onClose={modal.close} />)
  }

  return (
    <>
      <LineTitle title="Dicionários" />

      <span>Adicionar dicionário</span>
      <button
        className="stroke"
        title="Adicionar um dicionário"
        onClick={HandleAddDictionary}
        onMouseEnter={hoverFocus}
      >
        <AddIcon className="use-main-colors" />
        Adicionar
      </button>

      <span>Importar dicionário</span>
      <button
        className="stroke"
        title="Importar um dicionário"
        onClick={HandleImportDictionary}
        onMouseEnter={hoverFocus}
      >
        <DonwloadIcon />
        Importar
      </button>
    </>
  )
}
