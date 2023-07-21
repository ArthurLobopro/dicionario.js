import { DictionaryController } from "../../../../store/Controllers/Dictionary"
import { CircleButton } from "../../../components/base/CircleButton"
import { EditIcon, EyeIcon, TrashIcon } from "../../../components/icons"
import { WarningModal } from "../../../components/modals"
import { EditWordModal, ViewWordModal } from "../../../components/modals/word"
import { useModal } from "../../../hooks/useModal"

interface WordProps {
  word: {
    lastEdit?: Date | undefined
    definition: string
    register: Date
    word: string
  }
  modal: ReturnType<typeof useModal>
  dictionary: DictionaryController
  reload: () => void
}
export function Word(props: WordProps) {
  const { modal, word, dictionary, reload } = props

  function ShowViewModal() {
    modal.open(
      <ViewWordModal
        onClose={modal.close}
        dictionary={dictionary}
        word={word.word}
      />,
    )
  }

  function DeleteWord() {
    modal.open(
      <WarningModal
        title="Você tem certeza?"
        onClose={(confirm) => {
          if (confirm) {
            dictionary.Words.deleteWord(word.word)
            reload()
          }
          modal.close()
        }}
      >
        Essa ação é irreversível. Deseja realmente excluir esta palavra?
      </WarningModal>,
    )
  }

  return (
    <div className="word" key={word.word} onDoubleClick={ShowViewModal}>
      <div className="content">
        <div className="word-header capitalize">{word.word}</div>
        <div className="word-definition">{word.definition}</div>
      </div>
      <div className="controls">
        <CircleButton title="Visualizar" onClick={ShowViewModal}>
          <EyeIcon />
        </CircleButton>

        <CircleButton
          title="Editar"
          onClick={() => {
            modal.open(
              <EditWordModal
                word={word.word}
                dictionary={dictionary.name}
                onClose={() => {
                  modal.close()
                  reload()
                }}
              />,
            )
          }}
        >
          <EditIcon id="edit" />
        </CircleButton>

        <CircleButton title="Apagar" onClick={DeleteWord}>
          <TrashIcon id="delete" />
        </CircleButton>
      </div>
    </div>
  )
}
