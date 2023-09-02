import { zodResolver } from "@hookform/resolvers/zod"
import { ipcRenderer } from "electron"
import { useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { SuccessModal, WarningModal } from ".."
import { api } from "../../../../store/Api"
import { DictionaryController } from "../../../../store/Controllers/Dictionary"
import { wordSchema } from "../../../../store/ZodSchemas/word"
import { frame } from "../../../Frame"
import { useModal } from "../../../hooks/useModal"
import { Form, If, ValidatedInput } from "../../base"
import { Modal } from "../base/Modal"
import { CloseModalButton, OkButton } from "../base/ModalButtons"
import { ModalWrapper } from "../base/Wrapper"

import {
  defaultErrorHandler,
  hookformOnErrorFactory,
} from "../../../ErrorHandler"

const create_word_schema = wordSchema.pick({
  word: true,
  definition: true,
})

type CreateWordData = z.infer<typeof create_word_schema>

interface AddWordModalProps {
  dictionary: DictionaryController
  onClose: (v?: boolean) => void
}

export function AddWordModal(props: AddWordModalProps) {
  const { register, handleSubmit, watch } = useForm<CreateWordData>({
    resolver: zodResolver(create_word_schema),
    defaultValues: {
      word: "",
      definition: "",
    },
  })

  const { dictionary } = props
  const { word, definition } = watch()

  const word_already_exists = dictionary.Words.alreadyExists(word)
  const hasChanges = word.length + definition.length > 0

  const modal = useModal()

  const shouldClose = useCallback(async (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!hasChanges) {
        return resolve(true)
      }

      modal.open(
        <WarningModal
          onClose={(value) => {
            resolve(value)
            modal.close()
          }}
        >
          Você tem certeza que deseja sair? Os dados não salvos serão perdidos.
        </WarningModal>,
      )
    })
  }, [hasChanges])

  useEffect(() => {
    frame.instance.setBeforeCloseCallback(shouldClose)

    return () => frame.instance.setBeforeCloseCallback()
  }, [shouldClose])

  useEffect(() => {
    ipcRenderer.send("update-spellchecker", dictionary.languages)
  }, [])

  function onSubmit(data: CreateWordData) {
    if (!hasChanges) return props.onClose()

    try {
      api.dictionaries.getDictionary(dictionary.name).Words.addWord(data)

      modal.open(
        <SuccessModal
          message="Palavra adicionada com sucesso!"
          onClose={props.onClose.bind(null, true)}
        />,
      )
    } catch (error) {
      defaultErrorHandler(error, modal)
    }
  }

  const onError = hookformOnErrorFactory(modal)

  return (
    <ModalWrapper>
      <Modal
        type="alert"
        className="full dashed-border-modal"
        onClose={props.onClose}
        shouldClose={shouldClose}
      >
        {modal.content}
        <div className="dashed-border spacing-16 flex-column fill-heigth">
          <CloseModalButton />

          <Form
            className="grid-fill-center gap fill-heigth"
            onSubmit={handleSubmit(onSubmit, onError)}
          >
            <label className="flex-column gap-4">
              Palavra
              <ValidatedInput
                register={register("word")}
                hasError={word_already_exists}
                errorMessage={
                  word_already_exists
                    ? `A palavra "${word}" já existe neste dicionário.`
                    : ""
                }
                inputProps={{
                  placeholder: "Palavra",
                  autoFocus: true,
                }}
              />
            </label>

            <label className="t-wrapper grid-fill-bottom gap-4">
              Significado
              <textarea
                minLength={5}
                placeholder="Significados que a palavra pode ter"
                {...register("definition")}
              ></textarea>
            </label>

            <If
              condition={hasChanges}
              else={<OkButton text="Fechar" autoFocus={false} />}
            >
              <button type="submit">Adicionar</button>
            </If>
          </Form>
        </div>
      </Modal>
    </ModalWrapper>
  )
}
