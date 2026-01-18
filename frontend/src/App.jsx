import "./styles/App.css"
import Weather_App from "./components/Weather_App.jsx";
import { ThemeProvider } from "./context/ThemeContext";



function App() {
  return (
    <ThemeProvider>
      <Weather_App />
    </ThemeProvider>
  )
}

export default App;