import { DictionaryController } from "../../../../store/Controllers/Dictionary"
import { formatDate } from "../../../Util"
import { CircleButton } from "../../base"
import { CloseIcon } from "../../icons"
import { Modal } from "../base/Modal"
import { OkButton } from "../base/ModalButtons"
import { ModalWrapper } from "../base/Wrapper"

interface ViewWordModalProps {
  dictionary: DictionaryController
  word: string
  onClose: () => void
}

export function ViewWordModal(props: ViewWordModalProps) {
  const word_data = props.dictionary.Words.getWords()[props.word]

  return (
    <ModalWrapper>
      <Modal
        onClose={props.onClose}
        type="alert"
        className="full"
        id="view-word"
      >
        <div className="dashed-border spacing-16">
          <CircleButton title="Fechar" onClick={props.onClose} useDiv={true}>
            <CloseIcon />
          </CircleButton>

          <h1 className="flex-center capitalize">{props.word}</h1>
          <textarea
            readOnly
            tabIndex={-1}
            className="info big full-heigth"
            value={word_data.definition}
          ></textarea>
          <div className="date-wrapper">
            <div className="flex-column gap-10">
              <span>Data de registro</span>
              <span className="info">
                {formatDate(word_data.register.toISOString())}
              </span>
            </div>
            {word_data.lastEdit ? (
              <div className="flex-column gap-10">
                <span>Última edição</span>
                <span className="info">
                  {formatDate(word_data.lastEdit.toISOString())}
                </span>
              </div>
            ) : null}
          </div>
          <OkButton />
        </div>
      </Modal>
    </ModalWrapper>
  )
}
