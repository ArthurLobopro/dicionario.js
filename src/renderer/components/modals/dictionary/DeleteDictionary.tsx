import { FormEvent } from "react"
import { api } from "../../../../store/Api"
import { DictionaryController } from "../../../../store/Controllers/Dictionary"
import { defaultErrorHandler } from "../../../ErrorHandler"
import { useModal } from "../../../hooks/useModal"
import { ErrorModal } from "../Error"
import { FormModal } from "../FormModal"
import { SuccessModal } from "../Success"
import { WarningModal } from "../Warning"

interface modal_props {
  onClose: (v?: boolean) => void
  dictionary: DictionaryController
}

export function DeleteDictionaryModal(props: modal_props) {
  const { dictionary } = props
  const modal = useModal()

  async function onDelete(ev: FormEvent) {
    ev.preventDefault()
    ev.stopPropagation()

    if (dictionary.isDefault) {
      return modal.open(
        <ErrorModal
          onClose={modal.close}
          message={`Você não pode deletar o dicionário padrão`}
        />,
      )
    }

    function deleteDictionary() {
      try {
        api.dictionaries.removeDictionary(dictionary.name)
        modal.open(
          <SuccessModal
            onClose={() => props.onClose(true)}
            message={`Dicionário "${dictionary.name}" deletado com sucesso`}
          />,
        )
      } catch (error) {
        defaultErrorHandler(error, modal)
      }
    }

    const word_count = dictionary.Words.length

    if (word_count === 0) {
      return deleteDictionary()
    } else {
      modal.open(
        <WarningModal
          title="Você tem certeza?"
          onClose={(confirmed) => {
            if (confirmed) {
              deleteDictionary()
            } else {
              props.onClose()
            }
          }}
        >
          O dicionário <strong>"{dictionary.name}"</strong> possui{" "}
          <strong>{word_count}</strong> palavra{word_count > 1 ? "s" : ""},
          deseja apagá-lo mesmo assim? <br />
          Lembre-se: Esta ação não pode ser desfeita.
        </WarningModal>,
      )
    }
  }

  return (
    <FormModal
      onClose={props.onClose}
      onSubmit={onDelete}
      title="Deletar Dicionário"
      submitText="Deletar"
    >
      {modal.content}
      Deletar o dicionário <strong>{dictionary.name}</strong>?
    </FormModal>
  )
}
