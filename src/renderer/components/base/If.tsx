import { memo } from "react"

type IfProps = React.PropsWithChildren<{
  condition: boolean
  else?: React.ReactNode
}>

export const If = memo(function If(props: IfProps) {
  const else_component = <>{props.else}</> || null
  return props.condition ? <>{props.children}</> : else_component
})
