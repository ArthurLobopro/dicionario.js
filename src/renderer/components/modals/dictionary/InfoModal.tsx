import { DictionaryController } from "../../../../store/Controllers/Dictionary"
import { formatDate } from "../../../Util"
import { If } from "../../base/If"
import { BlueInfoIcon } from "../../icons"
import { ModalWithIcon } from "../ModalWithIcon"

interface DictionaryInfoModalProps {
  dictionary: DictionaryController
  onClose: () => void
}

export function DictionaryInfoModal(props: DictionaryInfoModalProps) {
  const wordsCount = props.dictionary.Words.length
  const newerWord = props.dictionary.Words.getNewerWord()
  const olderWord = props.dictionary.Words.getOlderWord()
  const biggerDefinition = props.dictionary.Words.getBiggerDefinition()

  const newerRegister =
    newerWord?.register && formatDate(newerWord.register.toISOString())
  const olderRegister =
    olderWord?.register && formatDate(olderWord.register.toISOString())

  return (
    <ModalWithIcon
      type="alert"
      title={`Informações de: ${props.dictionary.name}`}
      onClose={props.onClose}
      children={
        <>
          <p>
            Palavras cadastradas: {wordsCount} palavra
            {wordsCount > 1 ? "s" : ""}
          </p>

          <If condition={!!newerWord}>
            <p className="flex gap-4 align-center">
              Primeiro Registro:
              <span className="info">
                {newerWord?.word} ({newerRegister})
              </span>
            </p>
          </If>

          <If condition={!!olderWord}>
            <p className="flex gap-4 align-center">
              Último Registro:
              <span className="info">
                {olderWord?.word} ({olderRegister})
              </span>
            </p>
          </If>

          <If condition={!!biggerDefinition}>
            <p className="flex gap-4 align-center">
              Maior Definição:
              <span className="info">
                {biggerDefinition?.word} ({biggerDefinition?.definition.length}{" "}
                caracteres)
              </span>
            </p>
          </If>
        </>
      }
      icon={<BlueInfoIcon />}
    />
  )
}
