import { useContext, useRef, useState } from "react"
import { CircleButton } from "../../../components/base"
import { ContextMenu, Item } from "../../../components/context-menu"
import { ViewContext } from "../../../contexts/ViewContext"

import {
  EditIcon,
  MenuIcon,
  MinifiedTrashIcon,
  UploadIcon,
} from "../../../components/icons"

import {
  DeleteDictionaryModal,
  EditDictionaryModal,
  ExportDictionaryModal,
} from "../../../components/modals/dictionary"

export function Menu() {
  const menuRef = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)

  const { modal, dictionary, reload } = useContext(ViewContext)

  function handleClose() {
    setOpen(false)
  }

  function handleEditDictionary() {
    modal.open(<EditDictionaryModal onClose={modal.close} />)
    handleClose()
  }

  function handleDeleteDictionary() {
    modal.open(
      <DeleteDictionaryModal
        dictionary={dictionary}
        onClose={(deleted?: boolean) => {
          deleted && reload()
          modal.close()
        }}
      />,
    )
    handleClose()
  }

  function handleExportDictionary() {
    modal.open(<ExportDictionaryModal onClose={modal.close} />)
    handleClose()
  }

  return (
    <CircleButton
      onClick={() => setOpen(!open)}
      title={open ? "" : "Mostrar Menu"}
      ref={menuRef}
    >
      <MenuIcon />
      <ContextMenu target={menuRef} onClose={handleClose} open={open}>
        <Item
          text="Editar Dicionário"
          onClick={handleEditDictionary}
          icon={<EditIcon />}
        />
        <Item
          text="Exportar Dicionário"
          onClick={handleExportDictionary}
          icon={<UploadIcon />}
        />
        <Item
          text="Deletar Dicionário"
          disabled={dictionary.isDefault}
          onClick={handleDeleteDictionary}
          icon={<MinifiedTrashIcon />}
        />
      </ContextMenu>
    </CircleButton>
  )
}
