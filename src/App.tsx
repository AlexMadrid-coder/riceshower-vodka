import { ThemeProvider } from './contexts/ThemeContext';
import AutomationFlowPage from './pages/AutomationFlow/AutomationFlowPage';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <div className="app">
        <AutomationFlowPage />
      </div>
    </ThemeProvider>
  );
}

export default App;
