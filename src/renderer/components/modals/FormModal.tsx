import { useRef } from "react"
import { ModalWrapper } from "./Wrapper"

interface FormModalProps {
    title: string
    children: React.ReactNode
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    onClose: () => void
    submitText?: string
    cancelText?: string
}

export function FormModal(props: FormModalProps) {
    const modalRef = useRef<HTMLFormElement>(null)
    const firstRender = useRef(true)

    function handleAnimationEnd() {
        if (firstRender.current) {
            firstRender.current = false
            modalRef.current?.classList.remove("show")
        } else if (modalRef.current?.classList.contains("close")) {
            props.onClose()
        }
    }

    function handleCancel() {
        modalRef.current?.classList.add("close")
    }

    return (
        <ModalWrapper>
            <form
                className="modal show"
                onSubmit={props.onSubmit}
                ref={modalRef}
                onAnimationEnd={handleAnimationEnd}
            >
                <div className="modal-header">
                    {props.title}
                </div>
                <div className="modal-body">
                    {props.children}
                </div>
                <div className="modal-footer">
                    <button type="submit">
                        {props.submitText ?? "Salvar"}
                    </button>
                    <button className="cancel" type="button" onClick={handleCancel}>
                        {props.cancelText ?? "Cancelar"}
                    </button>
                </div>
            </form>
        </ModalWrapper>
    )
}