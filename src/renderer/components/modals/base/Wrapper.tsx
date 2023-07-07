import { useEffect, useRef } from "react"

interface ModalWrapperProps {
    children: JSX.Element
}

export function ModalWrapper(props: ModalWrapperProps) {
    const dialogRef = useRef<HTMLDialogElement>(null)

    useEffect(() => {
        if (dialogRef.current) {
            try {
                dialogRef.current.open = false
                dialogRef.current.showModal()
            } catch (error) {
                console.error(error)
            }
        }
    }, [])

    return (
        <dialog className="modal-wrapper" ref={dialogRef}>
            {props.children}
        </dialog>
    )
}