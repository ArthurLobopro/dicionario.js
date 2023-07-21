import { api } from "../../../../store/Api"
import { frame } from "../../../Frame"
import { LineTitle, Switcher } from "../../../components/base"

export function AppearanceSection() {
  function handleToggleTheme() {
    api.options.toggleDarkMode()
    document.body.classList.toggle("dark")
    frame.updateTheme()
  }

  function handleToggleAnimations() {
    api.options.toggleAnimations()
  }

  return (
    <>
      <LineTitle title="Aparência" />

      <span>Modo escuro</span>
      <Switcher onToggle={handleToggleTheme} checked={api.options.darkMode} />

      <span>Animações</span>
      <Switcher
        onToggle={handleToggleAnimations}
        checked={api.options.animations}
      />
    </>
  )
}
