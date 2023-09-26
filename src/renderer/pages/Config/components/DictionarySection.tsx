import { hoverFocus } from "../../../Util"
import { LineTitle } from "../../../components/base"
import { AddIcon, DonwloadIcon, UploadIcon } from "../../../components/icons"
import { useModal } from "../../../hooks/useModal"

import { ExportDataModal } from "../../../components/modals/ExportData"
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

  function HandleExportData() {
    modal.open(<ExportDataModal onClose={modal.close} />)
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

      <span>Exportar Dados</span>
      <button
        className="stroke"
        title="Exportar Dados"
        onClick={HandleExportData}
        onMouseEnter={hoverFocus}
      >
        <UploadIcon />
        Exportar
      </button>
    </>
  )
}
