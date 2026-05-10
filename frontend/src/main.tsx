import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { store } from "@/store";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <TooltipProvider>
          <App />
          <Toaster position="bottom-right" richColors />
        </TooltipProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
