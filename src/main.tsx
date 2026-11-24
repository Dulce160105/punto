import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import "./styles.css";
const returnPath = sessionStorage.getItem("punto_pages_return");
if (returnPath) {
  sessionStorage.removeItem("punto_pages_return");
  const target = new URL(returnPath, window.location.origin);
  if (target.origin === window.location.origin && target.pathname.startsWith(import.meta.env.BASE_URL)) {
    window.history.replaceState(null, "", target.pathname + target.search + target.hash);
  }
}
const root = document.getElementById("root");
if (!root) throw new Error("No se encontró el contenedor de Punto");
createRoot(root).render(<RouterProvider router={getRouter()} />);
