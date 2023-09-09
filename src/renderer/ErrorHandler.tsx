import { FieldErrors } from "react-hook-form"
import { ZodError } from "zod"
import { ErrorModal } from "./components/modals"
import { modal } from "./hooks/useModal"

export function getHookformErrorMessage(errors: FieldErrors) {
  return Object.values(errors)
    .map((error) => error?.message)
    .join("\n")
}

export function getZodErrorMessage(error: ZodError) {
  return error.issues.map((issue) => issue.message).join("\n")
}

export function hookformOnErrorFactory(modal: modal) {
  return (errors: FieldErrors) => {
    const message = getHookformErrorMessage(errors)
    modal.open(<ErrorModal message={message} onClose={modal.close} />)
  }
}

export function defaultErrorHandler(error: unknown, modal: modal) {
  if (error instanceof ZodError) {
    const message = getZodErrorMessage(error)
    modal.open(<ErrorModal onClose={modal.close} message={message} />)
  } else {
    const message = (error as Error).message
    modal.open(<ErrorModal message={message} onClose={modal.close} />)
  }
}
