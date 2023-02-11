import { ToastContainer } from "react-toastify";
import AppContent from "./components/AppContent";
import AppFooter from "./components/AppFooter";
import AppHeader from "./components/AppHeader";
import { SettingsProvider } from "./context/SettingsContext";

function App() {
  return (
    <>
      <SettingsProvider>
        <AppHeader />
        <AppContent />
        <AppFooter />
      </SettingsProvider>
      <ToastContainer theme="colored" />
    </>
  );
}

export default App;
