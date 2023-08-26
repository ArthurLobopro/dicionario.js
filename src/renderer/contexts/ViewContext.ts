import { createContext } from "react"
import { api } from "../../store/Api"
import { DictionaryController } from "../../store/Controllers/Dictionary"
import { useModal } from "../hooks/useModal"

const getWords = () =>
  Object.entries(api.dictionaries.defaultDictionary.Words.wordsObject)

interface ViewPageContext {
  modal: ReturnType<typeof useModal>
  search: string
  words: ReturnType<typeof getWords>
  dictionary: DictionaryController
  wrapperRef: React.RefObject<HTMLDivElement>
  setSearch: (search: string) => void
  handleAddWord: () => void
  reload: () => void
}

export const ViewContext = createContext<ViewPageContext>({} as ViewPageContext)
