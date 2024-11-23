import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage'; // Your HomePage component
import Dashboard from './components/Dashboard'; // Your Dashboard component
import Layout from './components/Layout'; // The layout component we just created

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Define your routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
