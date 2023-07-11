import { zodResolver } from "@hookform/resolvers/zod"
import { ipcRenderer } from "electron"
import { FieldErrors, useForm } from "react-hook-form"
import z from "zod"
import { ErrorModal, SuccessModal } from "../"
import { api } from "../../../../store/Api"
import { useModal } from "../../../hooks/useModal"
import { SelectDictionary } from "../../selects/Dictionary"
import { FormModal } from "../FormModal"
interface ExportDictionaryModalProps {
  onClose: () => void
}

type data = {
  dictionary: string
  path: string
}

export function ExportDictionaryModal(props: ExportDictionaryModalProps) {
  const dataSchema = z.object({
    dictionary: z
      .string()
      .refine((value) => api.dictionaries.getDictionary(value) !== undefined, {
        message: "Dicionário não encontrado",
      }),
    path: z.string().refine((value) => value !== "", {
      message: "Escolha um local para exportar o dicionário",
    }),
  })

  const { setValue, watch, handleSubmit } = useForm({
    resolver: zodResolver(dataSchema),
    defaultValues: {
      dictionary: api.dictionaries.getDefaultDictionary().name,
      path: "",
    },
  })

  const path = watch("path")

  const modal = useModal()

  function handleExport(data: data) {
    try {
      api.dictionaries.exportDictionary(data.dictionary, data.path)

      modal.open(
        <SuccessModal
          onClose={props.onClose}
          message="Dicionário exportado com sucesso!"
        />,
      )
    } catch (error) {
      modal.open(
        <ErrorModal onClose={modal.close} message={(error as Error).message} />,
      )
    }
  }

  function handleExportError(errors: FieldErrors<data>) {
    const message = Object.values(errors)
      .map((error) => error?.message)
      .join("\n")

    modal.open(<ErrorModal onClose={modal.close} message={message} />)
  }

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
          <span>Exportar dicionário: </span>
          <SelectDictionary
            onChange={(value) => setValue("dictionary", value)}
          />
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
