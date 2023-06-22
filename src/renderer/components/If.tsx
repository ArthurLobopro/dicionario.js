type IfProps = React.PropsWithChildren<{
    condition: boolean
}>

export function If(props: IfProps) {
    return props.condition ? <>{props.children}</> : null
}