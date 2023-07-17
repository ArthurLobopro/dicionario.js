import { useState } from "react"

interface useModalProps {
  isVisible: boolean
  content: JSX.Element
}

export function useModal(props?: useModalProps) {
  const [isVisible, setIsVisible] = useState(props?.isVisible ?? false)
  const [content, setContent] = useState(props?.content || null)

  const hide = () => setIsVisible(false)
  const show = () => setIsVisible(true)

  const open = (content: JSX.Element) => {
    setContent(content)
    show()
  }

  const close = () => {
    setContent(null)
    hide()
  }

  return {
    get content() {
      return isVisible ? content : null
    },
    get isVisible() {
      return isVisible
    },

    setContent: (content: JSX.Element) => setContent(content),
    hide,
    show,
    open,
    close,
  }
}
