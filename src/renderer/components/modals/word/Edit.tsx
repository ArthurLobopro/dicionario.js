import { zodResolver } from "@hookform/resolvers/zod"
import { ipcRenderer } from "electron"
import { useEffect } from "react"
import { FieldErrors, useForm } from "react-hook-form"
import z from "zod"
import { ErrorModal, SuccessModal, WarningModal } from ".."
import { api } from "../../../../store/Api"
import { wordSchema } from "../../../../store/ZodSchemas/word"
import { useModal } from "../../../hooks/useModal"
import { Form, If } from "../../base"
import { Modal } from "../base/Modal"
import { CloseModalButton, OkButton } from "../base/ModalButtons"
import { ModalWrapper } from "../base/Wrapper"

interface EditWordModalProps {
  onClose: (edited?: boolean) => void
  word: string
  dictionary: string
}

const update_word_schema = wordSchema.pick({
  word: true,
  definition: true,
})

type UpdateWordData = z.infer<typeof update_word_schema>

export function EditWordModal(props: EditWordModalProps) {
  const dictionary = api.dictionaries.getDictionary(props.dictionary)

  const {
    register,
    handleSubmit,
    formState: { dirtyFields },
  } = useForm<UpdateWordData>({
    resolver: zodResolver(update_word_schema),
    defaultValues: {
      word: props.word,
      definition: dictionary.Words.getWord(props.word)?.definition,
    },
  })

  const modal = useModal()

  useEffect(() => {
    ipcRenderer.send("update-spellchecker", dictionary.languages)
  }, [])

  const hasChanges = Object.entries(dirtyFields).length > 0

  function onClose() {
    if (dirtyFields.definition || dirtyFields.word) {
      modal.open(
        <WarningModal
          onClose={(value) => {
            value && props.onClose()
            modal.close()
          }}
        >
          Você tem certeza que deseja sair? Os dados não salvos serão perdidos.
        </WarningModal>,
      )
    } else {
      props.onClose()
    }
  }

  function onError(errors: FieldErrors) {
    const message = Object.values(errors)
      .map((error) => error?.message)
      .join("\n")
    modal.open(<ErrorModal onClose={modal.hide} message={message} />)
  }

  function onSubmit(data: UpdateWordData) {
    if (!hasChanges) return props.onClose()

    try {
      dictionary.Words.updateWord(props.word as string, {
        ...data,
        new_word: data.word,
      })

      modal.open(
        <SuccessModal
          message="Palavra atualizada com sucesso!"
          onClose={props.onClose.bind(null, true)}
        />,
      )
    } catch (error: any) {
      console.log(error)
      const message = (error as Error).message
      modal.open(<ErrorModal message={message} onClose={modal.close} />)
    }
  }

  return (
    <ModalWrapper>
      <Modal type="alert" className="full word-action" onClose={onClose}>
        {modal.content}

        <div className="dashed-border spacing-16 flex-column fill-heigth">
          <CloseModalButton />

          <h1 className="flex-center">Editar Palavra</h1>
          <Form
            className="grid-fill-center gap fill-heigth"
            onSubmit={handleSubmit(onSubmit, onError)}
          >
            <label>
              Palavra
              <input
                type="text"
                placeholder="Palavra"
                minLength={3}
                tabIndex={1}
                {...register("word")}
              />
            </label>
            <div className="t-wrapper grid-fill-bottom">
              Significado
              <textarea
                minLength={5}
                tabIndex={2}
                placeholder="Significados que a palavra pode ter"
                {...register("definition")}
              ></textarea>
            </div>

            <If
              condition={hasChanges}
              else={<OkButton text="Fechar" autoFocus={false} />}
            >
              <button type="submit">Salvar</button>
            </If>
          </Form>
        </div>
      </Modal>
    </ModalWrapper>
  )
}
