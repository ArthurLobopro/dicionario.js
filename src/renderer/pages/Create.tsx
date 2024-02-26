import { SelectDictionary } from "../components/selects/Dictionary"
import { useCreatePage } from "../hooks/useCreatePage"

import {
  Form,
  Header,
  Page,
  ReturnButton,
  ValidatedInput,
} from "../components/base"

export function CreateScreen() {
  const {
    modal,
    dictionary,
    handleChangeDictionary,
    shouldCloseCallback,
    handleSubmit,
    hookForm: { watch, register },
  } = useCreatePage()

  const { word } = watch()

  const wordAlreadyExists = dictionary.Words.alreadyExists(word)

  return (
    <Page id="create">
      {modal.content}
      <Header
        title="Adicionar Palavra"
        left={<ReturnButton onClick={shouldCloseCallback} />}
      />
      <Form
        className="dashed-border spacing-16 grid-fill-center gap"
        onSubmit={handleSubmit}
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
