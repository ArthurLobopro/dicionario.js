import { useMemo, useRef } from "react"
import { CircleButton } from "../CircleButton"
import { If } from "../If"
import { CloseIcon } from "../icons"
import { ModalWrapper } from "./Wrapper"

type ModifyTypeProps = {
    type: "alert"
    onClose: () => void
} | {
    type: "confirm"
    onClose: (confirm: boolean) => void
}

export type ModalProps = {
    title: string
    message?: string
    closeIcon?: boolean,
    onClose: VoidFunction
}

type ModalWithIconsProps = (
    React.PropsWithChildren &
    Omit<ModalProps, "onClose"> &
    { icon: React.ReactNode } &
    ModifyTypeProps
)

export function ModalWithIcon(props: ModalWithIconsProps) {
    const { title, icon, children, onClose, closeIcon = true } = props

    const firstRender = useRef(true)

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

    function handleAnimationEnd() {
        if (firstRender.current) {
            firstRender.current = false
            modalRef.current?.classList.remove("show")
        } else {
            onClose(responseRef.current)
        }
    }

    return (
        <ModalWrapper>
            <div className="modal show"
                ref={modalRef}
                onAnimationEnd={handleAnimationEnd}
            >
                <div className="modal-header">
                    {title}
                    <If condition={closeIcon}>
                        <CircleButton title="Fechar" small onClick={() => handleClose(false)}>
                            <CloseIcon />
                        </CircleButton>
                    </If>
                </div>
                <div className="modal-body">
                    <div className="grid-left-center">
                        <div className="icon-wrapper">
                            {icon}
                        </div>
                        <div>
                            {children}
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <If
                        condition={props.type === "confirm"}
                        else={
                            <button onClick={handleClose as VoidFunction} autoFocus={true}>
                                Ok
                            </button>
                        }
                    >
                        <button onClick={() => handleClose(true)}>
                            Sim
                        </button>
                        <button onClick={() => handleClose(false)}>
                            Não
                        </button>
                    </If>
                </div>
            </div>
        </ModalWrapper>
    )
}