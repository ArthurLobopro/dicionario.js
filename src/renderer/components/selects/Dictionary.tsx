import { useEffect, useState } from "react"
import { api } from "../../../store/Api"

export interface select_props {
    onChange?: (value: string) => void
    default_value?: string
    disabled?: boolean
    titleMode?: boolean
}

export function SelectDictionary(props: select_props) {
    const { default_value = 0, disabled = false, titleMode = false } = props

    const isDisabled = disabled || api.dictionaries.getDictionariesNames().length === 1

    const default_dictionary = api.dictionaries.getDefaultDictionary().name

    const [selected, setSelected] = useState(default_value ? default_value : default_dictionary)

    const [names, setNames] = useState([] as string[])

    useEffect(() => {
        setNames(api.dictionaries.getDictionariesNames())
    }, [])

    useEffect(() => {
        props.onChange && props.onChange(selected)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected])

    useEffect(() => {
        setSelected(props.default_value || default_dictionary)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.default_value])

    return (
        <select
            className={titleMode ? "select-title" : ""} value={selected}
            onChange={e => setSelected(e.target.value)}
            {...(
                isDisabled ? {
                    tabIndex: -1,
                    disabled: true,
                    title: "Você já selecionou este dicionário ou ele é o único dicionário existente."
                } : {
                    title: "Selecione um dicionário"
                }
            )}
        >
            {names.map(name => (
                <option key={name} value={name}>{name}</option>
            ))}
        </select>
    )
}