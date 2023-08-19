import { useCallback } from "react"
import { DictionaryController } from "../../../../store/Controllers/Dictionary"
import { formatDate, getLangName } from "../../../Util"
import { useModal } from "../../../hooks/useModal"
import { CircleButton } from "../../base"
import { BlueInfoIcon, EyeIcon } from "../../icons"
import { ModalWithIcon } from "../ModalWithIcon"
import { ViewWordModal } from "../word"

interface DictionaryInfoModalProps {
  dictionary: DictionaryController
  onClose: () => void
}

export function DictionaryInfoModal(props: DictionaryInfoModalProps) {
  const wordsCount = props.dictionary.Words.length
  const newerWord = props.dictionary.Words.getNewerWord()
  const olderWord = props.dictionary.Words.getOlderWord()
  const biggerDefinition = props.dictionary.Words.getBiggerDefinition()
  const biggerLinesDefinition =
    props.dictionary.Words.getBiggerLinesDefinition()

  const newerRegister =
    newerWord?.register && formatDate(newerWord.register.toISOString())
  const olderRegister =
    olderWord?.register && formatDate(olderWord.register.toISOString())

  const modal = useModal()

  const handleShowWord = useCallback(
    (word: string) => {
      return () => {
        modal.open(
          <ViewWordModal
            word={word}
            onClose={modal.close}
            dictionary={props.dictionary}
          />,
        )
      }
    },
    [modal],
  )

  return (
    <ModalWithIcon
      type="alert"
      title={`Informações de: ${props.dictionary.name}`}
      onClose={props.onClose}
      children={
        <>
          {modal.content}
          <p>
            Palavras cadastradas: {wordsCount} palavra
            {wordsCount > 1 ? "s" : ""}
          </p>

          <p className="flex gap-4 align-center">
            Idiomas Verificados:
            <span className="info">
              {props.dictionary.languages
                .map((lang) => getLangName(lang) || lang)
                .join(", ")}
            </span>
          </p>

          {newerWord && (
            <p className="flex gap-4 align-center">
              Primeiro Registro:
              <span className="info">
                {newerWord.word} ({newerRegister})
              </span>
              <CircleButton
                title="Visualizar"
                onClick={handleShowWord(newerWord.word)}
              >
                <EyeIcon />
              </CircleButton>
            </p>
          )}

          {olderWord && (
            <p className="flex gap-4 align-center">
              Último Registro:
              <span className="info">
                {olderWord?.word} ({olderRegister})
              </span>
              <CircleButton
                title="Visualizar"
                onClick={handleShowWord(olderWord.word)}
              >
                <EyeIcon />
              </CircleButton>
            </p>
          )}

          {biggerDefinition && (
            <p className="flex gap-4 align-center">
              Maior Definição (caracteres):
              <span className="info">
                {biggerDefinition?.word} ({biggerDefinition?.definition.length}{" "}
                caracteres)
              </span>
              <CircleButton
                title="Visualizar"
                onClick={handleShowWord(biggerDefinition.word)}
              >
                <EyeIcon />
              </CircleButton>
            </p>
          )}

          {biggerLinesDefinition && (
            <p className="flex gap-4 align-center">
              Maior Definição (linhas):
              <span className="info">
                {biggerLinesDefinition?.word} (
                {biggerLinesDefinition?.definition.split("\n").length} linhas)
              </span>
              <CircleButton
                title="Visualizar"
                onClick={handleShowWord(biggerLinesDefinition.word)}
              >
                <EyeIcon />
              </CircleButton>
            </p>
          )}
        </>
      }
      icon={<BlueInfoIcon />}
    />
  )
}
