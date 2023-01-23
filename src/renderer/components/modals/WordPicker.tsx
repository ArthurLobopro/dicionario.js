import { useState } from "react"
import { WordsController } from "../../../store/Controllers/Words"
import { ModalWrapper } from "./Wrapper"

interface WordPickerProps {
    onClose: (words: string[]) => void
    title?: string
}

export function WordPicker(props: WordPickerProps) {
    const words = WordsController.GetWordsToSave(WordsController.GetWords()).map(word => word.word)
    const [wordsToSave, setWordsToSave] = useState([] as string[])

    function HandleSelectAll() {
        if (wordsToSave.length === words.length) {
            setWordsToSave([])
        } else {
            setWordsToSave(words)
        }
    }

    return (
        <ModalWrapper>
            <div className="modal">
                <div className="modal-header">
                    {props?.title || "Exportar palavras"}
                </div>
                <div className="modal-body word-picker-body">
                    <label>
                        <input type="checkbox" onChange={HandleSelectAll} checked={words.length === wordsToSave.length} />
                        Selecionar Todas
                    </label>

                    {words.map(word => (
                        <label key={word}>
                            <input type="checkbox" checked={wordsToSave.includes(word)} onChange={e => {
                                if (e.target.checked) {
                                    setWordsToSave([...wordsToSave, word])
                                } else {
                                    setWordsToSave(wordsToSave.filter(w => w !== word))
                                }
                            }} />
                            <span>{word}</span>
                        </label>
                    ))}

                </div>
                <div className="modal-footer">
                    <button
                        title={wordsToSave.length === 0 ?
                            "Selecione pelo menos uma palavra" : "Exportar as palavras selecionadas."
                        }
                        className={wordsToSave.length === 0 ? "disable" : ""}
                        onClick={wordsToSave.length === 0 ? undefined : () => props.onClose(wordsToSave)}
                    >
                        Exportar
                    </button>
                    <button className="cancel" onClick={() => props.onClose(wordsToSave)}>Cancelar</button>
                </div>
            </div>
        </ModalWrapper>
    )
}