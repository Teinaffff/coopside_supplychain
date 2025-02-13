import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import Cookies from "universal-cookie";
import App from "./App.tsx";
import "./index.css";
import { ToasterProvider } from "./lib/toast-provider";
import { QueryProvider } from "./lib/query-provider";

export const cookies = new Cookies();

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <QueryProvider>
      <ToasterProvider />
      <Router>
        <App />
      </Router>
    </QueryProvider>
  </Provider>
);
