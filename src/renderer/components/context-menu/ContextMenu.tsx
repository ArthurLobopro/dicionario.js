import { useClickOut } from "@arthur-lobo/react-onclickout"
import { useEffect, useRef, useState } from "react"

interface ContextMenuProps {
  children: React.ReactNode
  target: React.RefObject<HTMLElement>
  open: boolean
  onClose: () => void
}

export function ContextMenu(props: ContextMenuProps) {
  const { target, open, onClose } = props

  const [state, setState] = useState({
    x: 0,
    y: 0,
  })

  const ref = useRef<HTMLDivElement>(null)

  useClickOut({
    onClickOut: onClose,
    elementRef: ref,
  })

  useEffect(() => {
    try {
      const { x, y, height, width } = (
        target.current as HTMLElement
      )?.getBoundingClientRect()

      const selfWidth = ref.current?.clientWidth as number

      setState({
        x: x - (selfWidth || 0) + width,
        y: y + height + 4,
      })
    } catch (e) {
      console.error(e)
    }
  }, [open])

  return open ? (
    <div
      className="context-wrapper"
      style={{
        left: state.x,
        top: state.y,
      }}
      ref={ref}
      onClick={(event) => event.stopPropagation()}
    >
      <ul>{props.children}</ul>
    </div>
  ) : null
}
