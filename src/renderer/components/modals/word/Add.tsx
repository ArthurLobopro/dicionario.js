import { zodResolver } from "@hookform/resolvers/zod"
import { ipcRenderer } from "electron"
import { useEffect } from "react"
import { FieldErrors, useForm } from "react-hook-form"
import { ZodError, z } from "zod"
import { ErrorModal, SuccessModal, WarningModal } from ".."
import { api } from "../../../../store/Api"
import { DictionaryController } from "../../../../store/Controllers/Dictionary"
import { wordSchema } from "../../../../store/ZodSchemas/word"
import { frame } from "../../../Frame"
import { useModal } from "../../../hooks/useModal"
import { Form, If, ValidatedInput } from "../../base"
import { Modal } from "../base/Modal"
import { CloseModalButton, OkButton } from "../base/ModalButtons"
import { ModalWrapper } from "../base/Wrapper"

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

  useEffect(() => {
    ipcRenderer.send("update-spellchecker", dictionary.languages)
  }, [])

  useEffect(() => {
    frame.instance.setBeforeCloseCallback(shouldClose)

    return () => {
      frame.instance.setBeforeCloseCallback()
    }
  }, [word.length + definition.length > 0])

  const word_already_exists = (() => {
    try {
      return dictionary.Words.getWord(word)?.word === word
    } catch (error) {
      return false
    }
  })()

  const modal = useModal()

  async function askShouldClose(): Promise<boolean> {
    return new Promise((resolve) => {
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
  }

  const hasChanges = word.length + definition.length > 0

  const shouldClose = async (): Promise<boolean> => {
    if (!hasChanges) return true

    return await askShouldClose()
  }

  function onClose() {
    if (hasChanges) {
      askShouldClose().then((should_close) => {
        should_close && props.onClose()
      })
    } else {
      props.onClose()
    }
  }

  function onError(errors: FieldErrors) {
    const message = Object.values(errors)
      .map((error) => error?.message)
      .join("\n")
    modal.open(<ErrorModal message={message} onClose={modal.close} />)
  }

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
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const zod_error = error as ZodError
        const message = zod_error.issues
          .map((issue) => issue.message)
          .join("\n")
        modal.open(<ErrorModal onClose={modal.close} message={message} />)
      } else {
        const message = (error as Error).message
        modal.open(<ErrorModal message={message} onClose={modal.close} />)
      }
    }
  }

  return (
    <ModalWrapper>
      <Modal
        type="alert"
        className="full dashed-border-modal"
        onClose={onClose}
      >
        <div className="dashed-border spacing-16 flex-column fill-heigth">
          {modal.content}

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
