import { zodResolver } from "@hookform/resolvers/zod"
import { FieldErrors, useForm } from "react-hook-form"
import { z } from "zod"
import { ErrorModal, SuccessModal } from "../"
import { api } from "../../../../store/Api"
import { useModal } from "../../../hooks/useModal"
import { FormModal } from "../FormModal"

import {
  defaultErrorHandler,
  getHookformErrorMessage,
} from "../../../ErrorHandler"

interface addDictionaryProps {
  onClose: () => void
}

const create_dictionary_schema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  setDefault: z.boolean().default(false),
})

type createDictionaryProps = z.infer<typeof create_dictionary_schema>

export function AddDictionaryModal(props: addDictionaryProps) {
  const { register, handleSubmit } = useForm<createDictionaryProps>({
    resolver: zodResolver(create_dictionary_schema),
    defaultValues: {
      name: "",
      setDefault: false,
    },
  })

  const modal = useModal()

  function onSubmit(data: createDictionaryProps) {
    try {
      api.dictionaries.addDictionary(data.name, data.setDefault)

      modal.open(
        <SuccessModal
          onClose={props.onClose}
          message="Dicionário criado com sucesso"
        />,
      )
    } catch (error) {
      defaultErrorHandler(error, modal)
    }
  }

  function onError(errors: FieldErrors) {
    const message = getHookformErrorMessage(errors)
    modal.open(<ErrorModal onClose={modal.hide} message={message} />)
  }

  return (
    <FormModal
      title="Adicionar dicionário"
      onClose={props.onClose}
      onSubmit={handleSubmit(onSubmit, onError)}
      submitText="Adicionar"
    >
      {modal.content}
      <div className="input-wrapper gap-10 flex-column">
        <label>
          Nome
          <input
            type="text"
            className="simple"
            placeholder="Nome do dicionário"
            {...register("name")}
          />
        </label>

        <label>
          <span>Tornar padrão </span>
          <input type="checkbox" {...register("setDefault")} />
        </label>
      </div>
    </FormModal>
  )
}
