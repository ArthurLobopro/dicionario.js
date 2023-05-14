import { useEffect, useRef, useState } from "react"

interface SwitcherProps {
    onToggle: (checked: boolean) => void
    checked?: boolean
    title?: string
}

export function Switcher(props: SwitcherProps) {
    const { onToggle, checked = false } = props

    const [isChecked, setIsChecked] = useState(checked)

    const ref = useRef(null as unknown as HTMLInputElement)

    useEffect(() => {
        ref.current.checked = isChecked
    }, [isChecked])

    function HandleClick() {
        setIsChecked(!isChecked)
        onToggle(!checked)
    }

    return (
        <div className="switch" onClick={HandleClick} title={props.title}>
            <input ref={ref} type="checkbox" defaultChecked={checked} onChange={() => onToggle(!checked)} tabIndex={-1} />
            <span className="slider round"></span>
        </div>
    )
}