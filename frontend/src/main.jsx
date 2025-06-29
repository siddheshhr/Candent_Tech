import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { store } from "./redux/store.js";
import { persistor } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
/**
 * - Wraps the App component with Redux Provider for state management.
 * - Uses PersistGate to persist Redux state across reloads.
 * - Uses BrowserRouter for client-side routing.
 * - Applies global styles from index.css.
 */
createRoot(document.getElementById("root")).render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>
    </Provider>
  </PersistGate>
);
