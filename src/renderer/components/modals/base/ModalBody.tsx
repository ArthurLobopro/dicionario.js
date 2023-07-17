interface ModalBodyProps {
  children: React.ReactNode
}

export function ModalBody(props: ModalBodyProps) {
  return <div className="modal-body">{props.children}</div>
}
