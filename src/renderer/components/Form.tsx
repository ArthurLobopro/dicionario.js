import { useEffect, useRef } from "react"

interface FormProps extends React.HTMLProps<HTMLFormElement> { }

export function Form(props: FormProps) {
    const formRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        const eventHandler = (event: KeyboardEvent) => {
            if (event.key === "Enter" && event.ctrlKey) {
                formRef.current?.requestSubmit()
            }
        }

        formRef.current?.addEventListener("keydown", eventHandler)

        return () => {
            formRef.current?.removeEventListener("keydown", eventHandler)
        }
    }, [formRef.current])

    return (
        <form {...props} ref={formRef} />
    )
}