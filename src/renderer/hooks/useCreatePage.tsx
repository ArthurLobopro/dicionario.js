import { zodResolver } from "@hookform/resolvers/zod"
import { ipcRenderer } from "electron"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { api } from "../../store/Api"
import { wordSchema } from "../../store/ZodSchemas/word"
import { defaultErrorHandler, hookformOnErrorFactory } from "../ErrorHandler"
import { frame } from "../Frame"
import { SuccessModal, WarningModal } from "../components/modals"
import { useModal } from "./useModal"

const create_word_schema = wordSchema.pick({
  word: true,
  definition: true,
})

type CreateWordData = z.infer<typeof create_word_schema>

export function useCreatePage() {
  const modal = useModal()

  const [dictionary, setDictionary] = useState(
    api.dictionaries.defaultDictionary,
  )

  useEffect(() => {
    ipcRenderer.send("update-spellchecker", dictionary.languages)
  }, [dictionary.name])

  const hookForm = useForm<CreateWordData>({
    resolver: zodResolver(create_word_schema),
    defaultValues: {
      word: "",
      definition: "",
    },
  })

  const { definition, word } = hookForm.watch()

  const hasChanges = word.length + definition.length > 0

  const shouldCloseCallback = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      if (hasChanges) {
        modal.open(
          <WarningModal
            onClose={(value) => {
              resolve(value)
              modal.close()
            }}
          >
            Você tem certeza que deseja sair? Os dados não salvos serão
            perdidos.
          </WarningModal>,
        )
      } else {
        resolve(true)
      }
    })
  }, [hasChanges])

  useEffect(() => {
    frame.instance.setBeforeCloseCallback(shouldCloseCallback)

    return () => frame.instance.setBeforeCloseCallback()
  }, [shouldCloseCallback])

  function onSubmit(data: CreateWordData) {
    try {
      api.dictionaries.getDictionary(dictionary.name).Words.addWord(data)

      modal.open(
        <SuccessModal
          message="Palavra adicionada com sucesso!"
          onClose={() => {
            modal.close()
            hookForm.reset()
          }}
        />,
      )
    } catch (error) {
      defaultErrorHandler(error, modal)
    }
  }

  const onError = hookformOnErrorFactory(modal)

  const handleSubmit = hookForm.handleSubmit(onSubmit, onError)

  function handleChangeDictionary(name: string) {
    setDictionary(api.dictionaries.getDictionary(name))
  }

  return {
    modal,
    dictionary,
    hookForm,
    handleSubmit,
    shouldCloseCallback,
    handleChangeDictionary,
  }
}
