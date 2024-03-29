import { hoverFocus } from "../../../Util"
import { LineTitle } from "../../../components/base"
import { AddIcon, DonwloadIcon, UploadIcon } from "../../../components/icons"
import { ExportDataModal } from "../../../components/modals/ExportData"
import { ImportDataModal } from "../../../components/modals/ImportData"
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

  function HandleExportData() {
    modal.open(<ExportDataModal onClose={modal.close} />)
  }

  function HandleImportData() {
    modal.open(<ImportDataModal onClose={modal.close} />)
  }

  return (
    <>
      <LineTitle title="Dicionários" />

      <span>Adicionar dicionário</span>
      <button
        className="stroke"
        onMouseEnter={hoverFocus}
        title="Adicionar um dicionário"
        onClick={HandleAddDictionary}
      >
        <AddIcon className="use-main-colors" />
        Adicionar
      </button>

      <span>Importar dicionário</span>
      <button
        className="stroke"
        onMouseEnter={hoverFocus}
        title="Importar um dicionário"
        onClick={HandleImportDictionary}
      >
        <DonwloadIcon />
        Importar
      </button>

      <span>Exportar Dados</span>
      <button
        className="stroke"
        onMouseEnter={hoverFocus}
        title="Exportar Dados"
        onClick={HandleExportData}
      >
        <UploadIcon />
        Exportar
      </button>

      <span>Importar Dados</span>
      <button
        className="stroke"
        onMouseEnter={hoverFocus}
        title="Importar Dados"
        onClick={HandleImportData}
      >
        <DonwloadIcon />
        Importar
      </button>
    </>
  )
}
