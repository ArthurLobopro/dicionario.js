import { UseFormRegisterReturn } from "react-hook-form"
import { ErrorInfoIcon } from "./icons"

interface ValidatedInputProps {
  hasError: boolean
  errorMessage?: string
  register: UseFormRegisterReturn
  inputProps?: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
}

export function ValidatedInput(props: ValidatedInputProps) {
  const { hasError, errorMessage = "", register, inputProps } = props

  return (
    <div className="validated-input" data-error={hasError}>
      <input type="text" {...inputProps} {...register} />
      {hasError && (
        <div className="error flex-center" title={errorMessage}>
          <ErrorInfoIcon title="" titleId="" />
        </div>
      )}
    </div>
  )
}
