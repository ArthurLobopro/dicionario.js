import { forwardRef } from "react"

interface CircleButtonProps {
  onClick: () => void
  title: string
  children: React.ReactNode
  small?: boolean
  useDiv?: boolean
}

export const CircleButton = forwardRef(function CircleButton(
  props: CircleButtonProps,
  ref,
) {
  const Component = props.useDiv
    ? (props: any) => <div {...props} ref={ref} />
    : (props: any) => <button {...props} ref={ref} />

  return (
    <Component
      className={`circle-button ${props.small ? "small" : ""}`}
      onClick={props.onClick}
      title={props.title}
      tabIndex={props.useDiv ? undefined : -1}
    >
      {props.children}
    </Component>
  )
})
