import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ProcessList from './pages/ProcessList';
import ProcessDetail from './pages/ProcessDetail';
import ProcessNew from './pages/ProcessNew';
import APIDoc from './pages/APIDoc';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<ProcessList />} />
            <Route path="/process/:id" element={<ProcessDetail />} />
            <Route path="/new" element={<ProcessNew />} />
            <Route path="/edit/:id" element={<ProcessNew />} />
            <Route path="/api" element={<APIDoc />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
