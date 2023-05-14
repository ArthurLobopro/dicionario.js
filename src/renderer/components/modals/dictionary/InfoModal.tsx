import { DictionaryController } from "../../../../store/Controllers/Dictionary"
import { formatDate } from "../../../Util"
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

    const newerRegister = newerWord?.register && formatDate(newerWord.register.toISOString())
    const olderRegister = olderWord?.register && formatDate(olderWord.register.toISOString())

    return (
        <AlertModalWithIcon
            title={`Informações de: ${props.dictionary.name}`}
            onClose={props.onClose}
            children={<>
                <p>
                    Palavras cadastradas: {wordsCount} palavra{wordsCount > 1 ? "s" : ""}
                </p>
                {
                    newerWord &&
                    <p className="flex gap-4 align-center">
                        Primeiro Registro:
                        <span className="info">{newerWord.word} ({newerRegister})</span>
                    </p>
                }
                {
                    olderWord &&
                    <p className="flex gap-4 align-center">
                        Último Registro:
                        <span className="info">{olderWord.word} ({olderRegister})</span>
                    </p>
                }
            </>}
            icon={<BlueInfoIcon />}
        />
    )
}