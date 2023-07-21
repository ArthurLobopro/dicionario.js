import { useEffect, useRef } from "react"

interface ModalWrapperProps {
  children: JSX.Element
}

// Typescript doesn't know about these properties
type popoverExtends = {
  popover: string
  showPopover: VoidFunction
}

function trapFocus(element: HTMLElement) {
  element.onkeydown = (event) => {
    const focusableElements = element.querySelectorAll(
      'a[href], :is(button, input, select, textarea):not([disabled]), [tabindex]:not([tabindex="-1"])',
    )

    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement

    if (event.key === "Tab") {
      if (document.activeElement === firstElement && event.shiftKey) {
        event.preventDefault()
        lastElement.focus()
      }

      if (document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }
  }
}

export function ModalWrapper(props: ModalWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement & popoverExtends>(null)

  useEffect(() => {
    if (wrapperRef.current) {
      try {
        wrapperRef.current.popover = "true"
        wrapperRef.current.showPopover()
        trapFocus(wrapperRef.current)
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
