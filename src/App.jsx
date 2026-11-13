import { HashRouter } from "react-router-dom";
import AppShell from "./app/AppShell.jsx";

export default function App() {
  return (
    <HashRouter>
      <AppShell />
    </HashRouter>
  );
}
