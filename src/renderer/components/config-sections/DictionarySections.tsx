import { hoverFocus } from "../../Util"
import { useModal } from "../../hooks/useModal"
import { LineTitle } from "../base/LineTitle"
import {
    AddIcon,
    DonwloadIcon,
    EditIcon,
    MinifiedTrashIcon,
    UploadIcon,
} from "../icons"
import {
    AddDictionaryModal,
    DeleteDictionaryModal,
    EditDictionaryModal,
    ExportDictionaryModal,
    ImportDictionaryModal,
} from "../modals/dictionary"

interface DictionarySectionsProps {
  modal: ReturnType<typeof useModal>
}

export function DictionarySection(props: DictionarySectionsProps) {
  const { modal } = props

  function HandleAddDictionary() {
    modal.open(<AddDictionaryModal onClose={modal.close} />)
  }

  function HandleEditDictionary() {
    modal.open(<EditDictionaryModal onClose={modal.close} />)
  }

  function HandleDeleteDictionary() {
    modal.open(<DeleteDictionaryModal onClose={modal.close} />)
  }

  function HandleExportDictionary() {
    modal.open(<ExportDictionaryModal onClose={modal.close} />)
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

      <span>Editar dicionário</span>
      <button
        className="stroke"
        title="Editar um dicionário"
        onClick={HandleEditDictionary}
        onMouseEnter={hoverFocus}
      >
        <EditIcon className="use-main-colors" />
        Editar
      </button>

      <span className="warning">Deletar dicionário</span>
      <button
        className="stroke warning"
        title="Deletar um dicionário"
        onClick={HandleDeleteDictionary}
        onMouseEnter={hoverFocus}
      >
        <MinifiedTrashIcon className="use-main-colors" />
        Deletar
      </button>

      <span>Exportar dicionário</span>
      <button
        className="stroke"
        title="Exportar um dicionário"
        onClick={HandleExportDictionary}
        onMouseEnter={hoverFocus}
      >
        <UploadIcon />
        Exportar
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
