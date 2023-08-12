interface ItemProps {
  text: string
  icon?: React.ReactNode
  onClick: () => void
  disabled?: boolean
}

export function Item(props: ItemProps) {
  return (
    <li
      className={`context-item ${props.disabled ? "disabled" : ""}`}
      onClick={props.disabled ? undefined : props.onClick}
    >
      <div className="icon">{props.icon}</div>
      {props.text}
    </li>
  )
}
