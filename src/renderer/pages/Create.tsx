import { zodResolver } from "@hookform/resolvers/zod"
import { ipcRenderer } from "electron"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { api } from "../../store/Api"
import { wordSchema } from "../../store/ZodSchemas/word"
import { defaultErrorHandler, hookformOnErrorFactory } from "../ErrorHandler"
import { frame } from "../Frame"
import { SuccessModal, WarningModal } from "../components/modals"
import { SelectDictionary } from "../components/selects/Dictionary"
import { useModal } from "../hooks/useModal"

import {
  Form,
  Header,
  Page,
  ReturnButton,
  ValidatedInput,
} from "../components/base"

const create_word_schema = wordSchema.pick({
  word: true,
  definition: true,
})

type CreateWordData = z.infer<typeof create_word_schema>

export function CreateScreen() {
  const {
    register,
    handleSubmit,
    reset: resetFields,
    watch,
  } = useForm<CreateWordData>({
    resolver: zodResolver(create_word_schema),
    defaultValues: {
      word: "",
      definition: "",
    },
  })

  const [dictionary, setDictionary] = useState(
    api.dictionaries.defaultDictionary,
  )

  useEffect(() => {
    ipcRenderer.send("update-spellchecker", dictionary.languages)
  }, [dictionary.name])

  const { word, definition } = watch()

  const wordAlreadyExists = dictionary.Words.alreadyExists(word)
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

  const modal = useModal()

  function handleChangeDictionary(name: string) {
    setDictionary(api.dictionaries.getDictionary(name))
  }

  function onSubmit(data: CreateWordData) {
    try {
      api.dictionaries.getDictionary(dictionary.name).Words.addWord(data)

      modal.open(
        <SuccessModal
          message="Palavra adicionada com sucesso!"
          onClose={() => {
            modal.close()
            resetFields()
          }}
        />,
      )
    } catch (error) {
      defaultErrorHandler(error, modal)
    }
  }

  const onError = hookformOnErrorFactory(modal)

  return (
    <Page id="create">
      {modal.content}
      <Header
        title="Adicionar Palavra"
        left={<ReturnButton onClick={shouldCloseCallback} />}
      />
      <Form
        className="dashed-border spacing-16 grid-fill-center gap"
        onSubmit={handleSubmit(onSubmit, onError)}
      >
        <label>
          Salvar em
          <SelectDictionary
            default_value={dictionary.name}
            onChange={handleChangeDictionary}
          />
        </label>
        <label>
          Palavra
          <ValidatedInput
            register={register("word")}
            hasError={wordAlreadyExists}
            errorMessage={
              wordAlreadyExists
                ? `A palavra "${word}" já existe neste dicionário.`
                : ""
            }
            inputProps={{
              placeholder: "Palavra",
              tabIndex: 1,
            }}
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
        <button type="submit" tabIndex={3}>
          Adicionar
        </button>
      </Form>
    </Page>
  )
}
