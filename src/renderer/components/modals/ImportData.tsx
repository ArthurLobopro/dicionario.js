import { ipcRenderer } from "electron/renderer"
import fs from "node:fs"
import { FormEvent, useState } from "react"
import { ErrorModal, SuccessModal, WarningModal } from "."
import { api } from "../../../store/Api"
import {
  backupData,
  backupDataSchema,
} from "../../../store/ZodSchemas/exportdata"
import { defaultErrorHandler } from "../../ErrorHandler"
import { useModal } from "../../hooks/useModal"
import { If } from "../base"
import { WarningIcon } from "../icons"
import { FormModal } from "./FormModal"

function CheckFileContent(filePath: string) {
  const fileContent = fs.readFileSync(filePath, "utf-8")
  const json = JSON.parse(fileContent)
  const isValid = backupDataSchema.safeParse(json)

  if (isValid.success) {
    return { isValid: true, data: isValid.data }
  }

  return { isValid: false }
}

interface ImportDataModalProps {
  onClose: () => void
}

export function ImportDataModal(props: ImportDataModalProps) {
  const [selectedFile, setSelectedFile] = useState({
    path: "",
    content: {} as backupData,
  })

  const [action, setAction] = useState<"merge" | "replace">("merge")

  const modal = useModal()

  function HandlePickFile() {
    setSelectedFile({
      path: "",
      content: {} as backupData,
    })

    const file = ipcRenderer.sendSync("get-file")

    if (file === "canceled") {
      return
    }

    const check = CheckFileContent(file)

    if (!check.isValid) {
      return modal.open(
        <ErrorModal onClose={modal.close} message="Arquivo inválido" />,
      )
    }

    setSelectedFile({
      path: file,
      content: check.data as backupData,
    })

    setAction("merge")
  }

  const readyToImport = !!selectedFile.path

  function HandleSubmit(event: FormEvent) {
    event.preventDefault()
    event.stopPropagation()

    if (!readyToImport) {
      return
    }

    try {
      if (action === "merge") {
        api.importer.importData(selectedFile.content, action)

        modal.open(
          <SuccessModal
            message="Dados mesclados com sucesso"
            onClose={props.onClose}
          />,
        )
      }

      if (action === "replace") {
        modal.open(
          <WarningModal
            title="Você tem certeza?"
            children="Você irá perder todos os dados atuais ao realizar essa ação"
            onClose={(res) => {
              modal.close()

              if (res) {
                api.importer.importData(selectedFile.content, action)

                modal.open(
                  <SuccessModal
                    message="Dados substituídos com sucesso"
                    onClose={props.onClose}
                  />,
                )
              }
            }}
          />,
        )
      }
    } catch (error) {
      defaultErrorHandler(error, modal)
    }
  }

  return (
    <>
      {modal.content}
      <FormModal
        onClose={props.onClose}
        title="Importar Dados"
        submitText="Importar"
        disableSubmit={!readyToImport}
        onSubmit={HandleSubmit}
      >
        <div className="flex-column gap-10">
          <span>Arquivo:</span>
          <div className="flex gap-10">
            <input
              type="text"
              className="simple"
              readOnly
              value={selectedFile.path}
            />

            <button className="simple" onClick={HandlePickFile} type="button">
              Selecionar
            </button>
          </div>

          <If condition={readyToImport}>
            <div className="lines">
              <span>Tipo de importação:</span>
              <select
                onChange={(event) => {
                  setAction(event.target.value as "merge" | "replace")
                }}
                value={action}
              >
                <option value="merge">Mesclar</option>
                <option value="replace">Substituir</option>
              </select>
            </div>

            <If condition={action === "replace"}>
              <span className="warning flex gap-10 align-center">
                <WarningIcon />
                Ao substituir os dados, todos seus dados anteriores serão
                apagados.
              </span>
            </If>
          </If>
        </div>
      </FormModal>
    </>
  )
}
