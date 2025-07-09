import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Pointage20 from './pages/Pointage20';
import Pointage from './pages/Pointage';
import Effectif from './pages/Effectif';
import EffectifF20 from './pages/EffectifF20';
import Contract from './pages/Contract';
import Cart from './pages/Cart';
import Rib from './pages/Rib';
import Base from './pages/Base';
import Contact from './pages/Contact';
import TacheEquipe from './pages/TacheEquipe';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pointage20" element={<Pointage20 />} />
          <Route path="/pointage" element={<Pointage />} />
          <Route path="/effectif" element={<Effectif />} />
          <Route path="/effectif-f20" element={<EffectifF20 />} />
          <Route path="/contract" element={<Contract />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/rib" element={<Rib />} />
          <Route path="/base" element={<Base />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/tache-equipe" element={<TacheEquipe />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;