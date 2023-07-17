import { memo } from "react"

interface LineTitleProps {
  title: string
  className?: string
}

export const LineTitle = memo(function LineTitle(props: LineTitleProps) {
  return (
    <div className={["line-title", props?.className].join(" ")}>
      <div className="spacer"></div>
      <span className="title">{props.title}</span>
      <div className="spacer"></div>
    </div>
  )
})
