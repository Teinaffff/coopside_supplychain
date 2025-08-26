import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import Cookies from "universal-cookie";
import App from "./App.tsx";
import "./index.css";
import { QueryProvider } from "./lib/query-provider";
import { ToasterProvider } from "./lib/toast-provider";
import store, { persistor } from "./store";

export const cookies = new Cookies();

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <QueryProvider>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <ToasterProvider />
        <Router>
          <App />
        </Router>
      </PersistGate>
    </QueryProvider>
  </Provider>
);
