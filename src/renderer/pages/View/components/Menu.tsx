import { useContext, useMemo, useRef, useState } from "react"
import { CircleButton } from "../../../components/base"
import { ContextMenu, Item } from "../../../components/context-menu"
import { ViewContext } from "../../../contexts/ViewContext"

import {
  AddIcon,
  EditIcon,
  InfoIcon,
  MenuIcon,
  MinifiedTrashIcon,
  UploadIcon,
} from "../../../components/icons"

import {
  AddDictionaryModal,
  DeleteDictionaryModal,
  DictionaryInfoModal,
  EditDictionaryModal,
  ExportDictionaryModal,
} from "../../../components/modals/dictionary"

export function Menu() {
  const menuRef = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)

  const { modal, dictionary, reload } = useContext(ViewContext)

  const {
    handleClose,
    handleAddDictionary,
    handleEditDictionary,
    handleDeleteDictionary,
    handleExportDictionary,
    handleShowInfo,
  } = useMemo(() => {
    function handleClose() {
      setOpen(false)
    }

    function handleAddDictionary() {
      modal.open(<AddDictionaryModal onClose={modal.close} />)
      handleClose()
    }

    function handleEditDictionary() {
      modal.open(
        <EditDictionaryModal
          dictionary={dictionary}
          onClose={(edited?: boolean) => {
            edited && reload()
            modal.close()
          }}
        />,
      )
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
      modal.open(
        <ExportDictionaryModal dictionary={dictionary} onClose={modal.close} />,
      )
      handleClose()
    }

    function handleShowInfo() {
      modal.open(
        <DictionaryInfoModal dictionary={dictionary} onClose={modal.close} />,
      )
      handleClose()
    }

    return {
      handleClose,
      handleAddDictionary,
      handleEditDictionary,
      handleDeleteDictionary,
      handleExportDictionary,
      handleShowInfo,
    }
  }, [modal, dictionary, reload, setOpen])

  return (
    <CircleButton
      onClick={() => setOpen(!open)}
      title={open ? "" : "Mostrar Menu"}
      ref={menuRef}
    >
      <MenuIcon />
      <ContextMenu target={menuRef} onClose={handleClose} open={open}>
        <Item
          text="Criar novo dicionário"
          onClick={handleAddDictionary}
          icon={<AddIcon />}
        />
        <Item
          text="Editar dicionário"
          onClick={handleEditDictionary}
          icon={<EditIcon />}
        />
        <Item text="Informações" onClick={handleShowInfo} icon={<InfoIcon />} />
        <Item
          text="Exportar dicionário"
          onClick={handleExportDictionary}
          icon={<UploadIcon />}
        />
        <Item
          text="Deletar dicionário"
          disabled={dictionary.isDefault}
          onClick={handleDeleteDictionary}
          icon={<MinifiedTrashIcon />}
        />
      </ContextMenu>
    </CircleButton>
  )
}
