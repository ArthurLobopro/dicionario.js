import { Route, HashRouter as Router, Routes } from "react-router-dom"
import { Home } from "./pages/Home"
import { ConfigScreen } from "./pages/Config"

export function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/config" element={<ConfigScreen />} />
            </Routes>
        </Router>
    )
}