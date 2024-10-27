import { createContext } from "react"
import { DictionaryController } from "../../store/Controllers/Dictionary"
import { useModal } from "../hooks/useModal"

interface ViewPageContext {
  modal: ReturnType<typeof useModal>
  search: string
  searchRegex: RegExp
  words: typeof DictionaryController.prototype.Words.words
  dictionary: DictionaryController
  wrapperRef: React.RefObject<HTMLDivElement>
  setSearch: (search: string) => void
  handleAddWord: () => void
  reload: () => void
}

export const ViewContext = createContext<ViewPageContext>({} as ViewPageContext)
