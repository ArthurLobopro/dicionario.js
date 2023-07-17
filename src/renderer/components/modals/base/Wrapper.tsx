import { useEffect, useRef } from "react"

interface ModalWrapperProps {
  children: JSX.Element
}

// Typescript doesn't know about these properties
type popoverExtends = {
  popover: string
  showPopover: VoidFunction
}

export function ModalWrapper(props: ModalWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement & popoverExtends>(null)

  useEffect(() => {
    if (wrapperRef.current) {
      try {
        wrapperRef.current.popover = "true"
        wrapperRef.current.showPopover()
      } catch (error) {
        console.error(error)
      }
    }
  }, [])

  return (
    <div className="modal-wrapper" ref={wrapperRef}>
      {props.children}
    </div>
  )
}
