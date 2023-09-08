import { zodResolver } from "@hookform/resolvers/zod"
import { ipcRenderer } from "electron"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { SuccessModal } from "../"
import { api } from "../../../../store/Api"
import { DictionaryController } from "../../../../store/Controllers/Dictionary"
import { useModal } from "../../../hooks/useModal"
import { FormModal } from "../FormModal"

import {
  defaultErrorHandler,
  hookformOnErrorFactory,
} from "../../../ErrorHandler"

interface ExportDictionaryModalProps {
  onClose: () => void
  dictionary: DictionaryController
}

const dataSchema = z.object({
  path: z.string().refine((value) => value !== "", {
    message: "Escolha um local para exportar o dicionário",
  }),
})

type data = z.infer<typeof dataSchema>

function getDefaulPath(): string {
  return ipcRenderer.sendSync("get-path", "documents")
}

export function ExportDictionaryModal(props: ExportDictionaryModalProps) {
  const { setValue, watch, handleSubmit } = useForm({
    resolver: zodResolver(dataSchema),
    defaultValues: {
      path: getDefaulPath(),
    },
  })

  const { dictionary } = props
  const path = watch("path")
  const modal = useModal()

  function handleExport(data: data) {
    try {
      api.dictionaries.exportDictionary(dictionary.name, data.path)

      modal.open(
        <SuccessModal
          onClose={props.onClose}
          message="Dicionário exportado com sucesso!"
        />,
      )
    } catch (error) {
      defaultErrorHandler(error, modal)
    }
  }

  const handleExportError = hookformOnErrorFactory(modal)

  function handlePickFolder() {
    const folder = ipcRenderer.sendSync("get-folder")
    if (folder === "canceled") return
    setValue("path", folder)
  }

  return (
    <FormModal
      disableSubmit={path === ""}
      title="Exportar dicionário"
      onSubmit={handleSubmit(handleExport, handleExportError)}
      onClose={props.onClose}
      submitText="Exportar"
    >
      {modal.content}
      <div className="flex-column gap-10">
        <div className="flex align-center gap-10">
          <span>
            Exportar dicionário "<strong>{dictionary.name}</strong>"
          </span>
        </div>
        <div className="grid-column-fill-center align-center gap-10">
          <span>Salvar em: </span>
          <input type="text" className="simple" readOnly value={path} />
          <button className="simple" type="button" onClick={handlePickFolder}>
            Escolher pasta
          </button>
        </div>
      </div>
    </FormModal>
  )
}
