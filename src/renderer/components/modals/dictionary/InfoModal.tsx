import { DictionaryController } from "../../../../store/Controllers/Dictionary"
import { BlueInfoIcon } from "../../icons"
import { AlertModalWithIcon } from "../Alert"

interface DictionaryInfoModalProps {
    dictionary: DictionaryController
    onClose: () => void
}

export function DictionaryInfoModal(props: DictionaryInfoModalProps) {
    const wordsCount = props.dictionary.Words.length
    const newerWord = props.dictionary.Words.getNewerWord()
    const olderWord = props.dictionary.Words.getOlderWord()

    return (
        <AlertModalWithIcon
            title={`Informações de: ${props.dictionary.name}`}
            onClose={props.onClose}
            children={<>
                <p>
                    Quantidade de palavras: {wordsCount} palavra{wordsCount > 1 ? "s" : ""}
                </p>
                <p>
                    Primeira palavra cadastrada: {newerWord}
                </p>
                <p>
                    Última palavra cadastrada: {olderWord}
                </p>
            </>}
            icon={<BlueInfoIcon />}
        />
    )
}