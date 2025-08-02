import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CodeGenerator from './pages/CodeGenerator';
import FigmaToCode from './pages/FigmaToCode';
import Projects from './pages/Projects';
import Deployments from './pages/Deployments';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/code-generator" element={<CodeGenerator />} />
            <Route path="/figma-to-code" element={<FigmaToCode />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/deployments" element={<Deployments />} />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App; 