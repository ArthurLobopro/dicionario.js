interface HeaderProps {
  title: string | JSX.Element
  left?: JSX.Element
  right?: JSX.Element
}

export function Header(props: HeaderProps) {
  return (
    <header>
      <div className="left">{props.left}</div>
      <div className="title">
        {typeof props.title === "string" ? <h1>{props.title}</h1> : props.title}
      </div>
      <div className="right">{props.right}</div>
    </header>
  )
}
