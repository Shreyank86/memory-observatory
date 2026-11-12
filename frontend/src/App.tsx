import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import Memories from './pages/Memories/Memories';
import SemanticSearch from './pages/SemanticSearch/SemanticSearch';
import Projects from './pages/Projects/Projects';
import AIAgents from './pages/AIAgents/AIAgents';
import RetrievalTraces from './pages/RetrievalTraces/RetrievalTraces';
import MemoryLifecycle from './pages/MemoryLifecycle/MemoryLifecycle';
import Analytics from './pages/Analytics/Analytics';
import Settings from './pages/Settings/Settings';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/memories" element={<Memories />} />
            <Route path="/search" element={<SemanticSearch />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/agents" element={<AIAgents />} />
            <Route path="/traces" element={<RetrievalTraces />} />
            <Route path="/lifecycle" element={<MemoryLifecycle />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
