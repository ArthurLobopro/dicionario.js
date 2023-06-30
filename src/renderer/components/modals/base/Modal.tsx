import { useMemo, useRef } from "react"
import { ModalContext } from "./ModalContext"

type ModalProps = ({
    type: "alert"
    onClose: () => void
} | {
    type: "confirm"
    onClose: (confirm: boolean) => void
}) & {
    children: React.ReactNode
}

export function Modal(props: ModalProps) {

    const modalRef = useRef<HTMLDivElement>(null)
    const responseRef = useRef(false)

    const handleClose = useMemo(() => {
        return props.type === "alert"
            ? () => {
                modalRef.current?.classList.add("close")
            } : (confirm: boolean) => {
                responseRef.current = confirm
                modalRef.current?.classList.add("close")
            }
    }, [props.type])

    function handleAnimationEnd(): any {
        if (!modalRef.current) {
            return setTimeout(handleAnimationEnd, 20)
        }

        if (modalRef.current.classList.contains("show")) {
            return modalRef.current.classList.remove("show")
        }

        if (modalRef.current.classList.contains("close")) {
            return props.onClose(responseRef.current)
        }
    }

    return (
        <ModalContext.Provider value={{ onClose: handleClose }}>
            <div className="modal show" ref={modalRef} onAnimationEnd={handleAnimationEnd}>
                {props.children}
            </div>
        </ModalContext.Provider>
    )
}