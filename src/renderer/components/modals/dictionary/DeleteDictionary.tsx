import { useForm } from "react-hook-form"
import { api } from "../../../../store/Api"
import { DictionariesController } from "../../../../store/Controllers/Dictionaries"
import { useModal } from "../../../hooks/useModal"
import { SelectDictionary } from "../../selects/Dictionary"
import { ErrorModal } from "../Error"
import { FormModal } from "../FormModal"
import { SuccessModal } from "../Success"
import { WarningModal } from "../Warning"

interface modal_props {
    onClose: () => void
}

interface deleteDictionaryProps {
    dictionary: string
}

export function DeleteDictionaryModal(props: modal_props) {
    const { handleSubmit, setValue } = useForm<deleteDictionaryProps>({
        defaultValues: {
            dictionary: api.dictionaries.getDefaultDictionary().name
        }
    })

    const modal = useModal()

    async function onDelete(data: deleteDictionaryProps) {
        const dictionary = data.dictionary

        if (dictionary === "") { return }

        if (dictionary === DictionariesController.getDefaultDictionary().name) {
            return modal.open(<ErrorModal
                onClose={modal.close}
                message={`Você não pode deletar o dicionário padrão`}
            />)
        }

        function deleteDictionary() {
            try {
                api.dictionaries.removeDictionary(dictionary)
                modal.open(<SuccessModal
                    onClose={props.onClose}
                    message={`Dicionário "${dictionary}" deletado com sucesso`}
                />)
            } catch (error) {
                modal.open(<ErrorModal
                    onClose={props.onClose}
                    message={`Houve um erro ao deletar o dicionário "${dictionary}"`}
                />)
            }
        }

        const word_count = api.dictionaries.getDictionary(dictionary).Words.length

        if (word_count === 0) {
            return deleteDictionary()
        } else {
            modal.open(<WarningModal
                title="Você tem certeza?"
                onClose={(confirmed) => {
                    if (confirmed) {
                        deleteDictionary()
                    } else {
                        modal.close()
                    }
                }}
            >
                O dicionário <strong>"{dictionary}"</strong> possui <strong>{word_count}</strong> palavra{word_count > 1 ? "s" : ""}, deseja apagá-lo mesmo assim? <br />
                Lembre-se: Esta ação não pode ser desfeita.
            </WarningModal>)
        }
    }

    return (
        <FormModal
            title="Deletar Dicionário" submitText="Deletar"
            onClose={props.onClose} onSubmit={handleSubmit(onDelete)}
        >
            {modal.content}
            <span>Deletar o dicinário: </span>
            <SelectDictionary onChange={value => setValue("dictionary", value)} />
        </FormModal>
    )
}