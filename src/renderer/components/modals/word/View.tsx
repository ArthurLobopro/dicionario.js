import { DictionaryController } from "../../../../store/Controllers/Dictionary"
import { formatDate } from "../../../Util"
import { Modal } from "../base/Modal"
import { CloseModalButton, OkButton } from "../base/ModalButtons"
import { ModalWrapper } from "../base/Wrapper"

interface ViewWordModalProps {
  dictionary: DictionaryController
  word: string
  onClose: () => void
}

export function ViewWordModal(props: ViewWordModalProps) {
  const word_data = props.dictionary.Words.getWord(props.word)

  return (
    <ModalWrapper>
      <Modal
        onClose={props.onClose}
        type="alert"
        className="full"
        id="view-word"
      >
        <div className="dashed-border spacing-16">
          <CloseModalButton />

          <h1 className="flex-center capitalize">{props.word}</h1>

          <div
            className="info big full-heigth"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {word_data.definition}
          </div>

          <div className="date-wrapper">
            <div className="flex-column gap-10">
              <span>Data de registro</span>
              <span className="info">{formatDate(word_data.register)}</span>
            </div>

            {word_data.lastEdit ? (
              <div className="flex-column gap-10">
                <span>Última edição</span>
                <span className="info">{formatDate(word_data.lastEdit)}</span>
              </div>
            ) : null}
          </div>

          <OkButton />
        </div>
      </Modal>
    </ModalWrapper>
  )
}
