import { Route, HashRouter as Router, Routes } from "react-router-dom"
import { ConfigScreen } from "./pages/Config"
import { CreateScreen } from "./pages/Create"
import { Home } from "./pages/Home"
import { ViewScreen } from "./pages/View"

export function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateScreen />} />
        <Route path="/create/:dictionary" element={<CreateScreen />} />
        <Route path="/config" element={<ConfigScreen />} />
        <Route path="/view" element={<ViewScreen />} />
      </Routes>
    </Router>
  )
}
