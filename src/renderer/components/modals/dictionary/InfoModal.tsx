import { useCallback, useMemo } from "react"
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
  const {
    length: wordCount,
    biggerDefinitionWord,
    biggerLinesDefinitionWord,
    newerWord,
    olderWord,
  } = props.dictionary.Words

  const newerRegister = useMemo(
    () => newerWord?.register && formatDate(newerWord.register),
    [newerWord?.register],
  )

  const olderRegister = useMemo(
    () => olderWord?.register && formatDate(olderWord.register),
    [olderWord?.register],
  )

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
      icon={<BlueInfoIcon />}
      children={
        <>
          {modal.content}
          <p>
            Palavras cadastradas: {wordCount} palavra
            {wordCount > 1 ? "s" : ""}
          </p>

          <p className="flex gap-4 align-center">
            Idiomas Verificados:
            <span className="info">
              {props.dictionary.languages
                .map((lang) => getLangName(lang) || lang)
                .join(", ")}
            </span>
          </p>

          {olderWord && (
            <p className="flex gap-4 align-center">
              Primeiro Registro:
              <span className="info">
                {olderWord.word} ({olderRegister})
              </span>
              <CircleButton
                title="Visualizar"
                onClick={handleShowWord(olderWord.word)}
                useDiv
              >
                <EyeIcon />
              </CircleButton>
            </p>
          )}

          {newerWord && (
            <p className="flex gap-4 align-center">
              Último Registro:
              <span className="info">
                {newerWord.word} ({newerRegister})
              </span>
              <CircleButton
                title="Visualizar"
                onClick={handleShowWord(newerWord.word)}
                useDiv
              >
                <EyeIcon />
              </CircleButton>
            </p>
          )}

          {biggerDefinitionWord && (
            <p className="flex gap-4 align-center">
              Maior Definição (caracteres):
              <span className="info">
                {biggerDefinitionWord.word} (
                {biggerDefinitionWord.definition.length} caracteres)
              </span>
              <CircleButton
                title="Visualizar"
                onClick={handleShowWord(biggerDefinitionWord.word)}
                useDiv
              >
                <EyeIcon />
              </CircleButton>
            </p>
          )}

          {biggerLinesDefinitionWord && (
            <p className="flex gap-4 align-center">
              Maior Definição (linhas):
              <span className="info">
                {biggerLinesDefinitionWord.word} (
                {biggerLinesDefinitionWord.definition.split("\n").length}{" "}
                linhas)
              </span>
              <CircleButton
                title="Visualizar"
                onClick={handleShowWord(biggerLinesDefinitionWord.word)}
                useDiv
              >
                <EyeIcon />
              </CircleButton>
            </p>
          )}
        </>
      }
    />
  )
}
