import { useState } from "react"

interface useModalProps {
    isVisible: boolean,
    content: JSX.Element
}

export function useModal(props?: useModalProps) {
    const [isVisible, setIsVisible] = useState(props?.isVisible ?? false)
    const [content, setContent] = useState(props?.content || null)

    return {
        get content() {
            return isVisible ? content : null
        },
        hide: () => setIsVisible(false),
        show: () => setIsVisible(true),
        setContent: (component: JSX.Element) => setContent(component)
    }
}