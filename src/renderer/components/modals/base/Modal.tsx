/* eslint-disable prettier/prettier */
import { useMemo, useRef } from "react"
import { ModalContext } from "../../../contexts/ModalContext"

type ModalProps = React.PropsWithChildren<
  (
    | {
      type: "alert"
      onClose: VoidFunction
    }
    | {
      type: "confirm"
      onClose: (confirm: boolean) => void
    }
  ) & {
    shouldClose?: () => Promise<boolean>
    className?: string
    id?: string
  }
>

export function Modal(props: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const responseRef = useRef(false)

  const handleClose = useMemo(() => {
    return props.type === "alert"
      ? async () => {
        if (props.shouldClose) {
          const should_close = await props.shouldClose()
          if (!should_close) {
            return
          }
        }

        modalRef.current?.classList.add("close")
      }
      : async (confirm: boolean) => {
        if (props.shouldClose) {
          const should_close = await props.shouldClose()
          if (!should_close) {
            return
          }
        }

        responseRef.current = confirm
        modalRef.current?.classList.add("close")
      }
  }, [props.type, props.shouldClose])

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
      <div
        className={`modal show ${props.className || ""}`}
        ref={modalRef}
        id={props.id}
        onAnimationEnd={handleAnimationEnd}
      >
        {props.children}
      </div>
    </ModalContext.Provider>
  )
}
