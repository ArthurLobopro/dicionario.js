import { zodResolver } from "@hookform/resolvers/zod"
import DeepEqual from "deep-equal"
import { ipcRenderer } from "electron"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { api } from "../../../../store/Api"
import { DictionaryController } from "../../../../store/Controllers/Dictionary"
import { dictionarySchema } from "../../../../store/ZodSchemas/dictionary"
import { getLangName } from "../../../Util"
import { useModal } from "../../../hooks/useModal"
import { CircleButton, If, LineTitle } from "../../base"
import { CloseIcon } from "../../icons"
import { FormModal } from "../FormModal"
import { SuccessModal } from "../Success"

interface editDictionaryProps {
  onClose: (v?: boolean) => void
  dictionary: DictionaryController
}

const edit_dictionary_schema = dictionarySchema
  .pick({ languages: true })
  .extend({
    newName: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
    setDefault: z.boolean(),
  })

const edit_dictionary_inputs_schema = edit_dictionary_schema.extend({
  language_to_add: z.string(),
})

type edit_dictionary = z.infer<typeof edit_dictionary_schema>

type edit_dictionary_inputs = z.infer<typeof edit_dictionary_inputs_schema>

export function EditDictionaryModal(props: editDictionaryProps) {
  const { dictionary } = props

  const default_dictionary_name = api.dictionaries.getDefaultDictionary().name

  const editing_default = dictionary.name === default_dictionary_name

  const modal = useModal()

  const {
    register,
    handleSubmit,
    setValue,
    resetField,
    watch,
    formState: { dirtyFields },
  } = useForm<edit_dictionary_inputs>({
    resolver: zodResolver(edit_dictionary_inputs_schema),
    defaultValues: {
      newName: dictionary.name,
      setDefault: false,
      languages: dictionary.languages,
      language_to_add: "NULL",
    },
  })

  const { languages, language_to_add } = watch()

  const hasChanges =
    !!Object.keys(dirtyFields).filter((key) => key !== "language_to_add")
      .length || !DeepEqual(languages, dictionary.languages)

  const available_languages = useMemo(() => {
    return ipcRenderer.sendSync("get-available-languages") as string[]
  }, [])

  function addLang() {
    if (language_to_add !== "NULL") {
      setValue("languages", [...languages, language_to_add])
      resetField("language_to_add")
    }
  }

  function removeLang(lang: string) {
    setValue(
      "languages",
      languages.filter((language) => language !== lang),
    )
  }

  function onSubmit(data: edit_dictionary) {
    api.dictionaries.editDictionary(
      dictionary.name,
      edit_dictionary_schema.parse(data),
    )

    modal.open(
      <SuccessModal
        message="Dicionário editado com sucesso!"
        onClose={props.onClose.bind(null, true)}
      />,
    )
  }

  return (
    <FormModal
      onSubmit={handleSubmit(onSubmit)}
      onClose={props.onClose}
      title="Editar Dicionário"
      submitText="Editar"
      disableSubmit={!hasChanges}
    >
      {modal.content}
      <div className="input-wrapper gap-10 flex-column">
        <div>
          <span>
            Editar dicionário "<strong>{dictionary.name}</strong>"
          </span>
        </div>
        <label>
          Nome
          <input className="simple" type="text" {...register("newName")} />
        </label>
        <If
          condition={!editing_default}
          else={<span>Este é o dicionário padrão.</span>}
        >
          <label>
            <span>Definir como padrão </span>
            <input type="checkbox" {...register("setDefault")} />
          </label>
        </If>
        <LineTitle title="Verificação gramatical" />
        Línguas usadas:
        <If
          condition={!!dictionary.languages.length}
          else={<span>Nenhuma língua selecionada.</span>}
        >
          <div className="flex gap-4" style={{ flexWrap: "wrap" }}>
            {languages.map((language, index) => (
              <LangWrap
                key={index}
                lang={language}
                onRemove={removeLang.bind(null, language)}
              />
            ))}
          </div>
        </If>
        <div className="flex-column">
          Adicionar Línguas:
          <div className="flex gap">
            <select {...register("language_to_add")}>
              <option value={"NULL"}>Selecionar Língua</option>
              {available_languages
                .filter((language) => !languages.includes(language))
                .map((language, index) => (
                  <option key={index} value={language}>
                    {getLangName(language) || language}
                  </option>
                ))}
            </select>
            <button
              className="simple"
              onClick={addLang}
              type="button"
              disabled={language_to_add === "NULL"}
            >
              Adicionar língua
            </button>
          </div>
        </div>
      </div>
    </FormModal>
  )
}

function LangWrap(props: { lang: string; onRemove: () => void }) {
  return (
    <div className="flex gap-4 info align-center">
      <span>{getLangName(props.lang)}</span>
      <CircleButton
        onClick={props.onRemove}
        title="Remover"
        small={true}
        useDiv
      >
        <CloseIcon width={10} height={10} />
      </CircleButton>
    </div>
  )
}
