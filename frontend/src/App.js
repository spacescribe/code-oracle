import React from 'react';
import Search from './components/Search';
import IndexRepo from "./components/IndexRepo";
import './App.css';

function App() {
  return (
    <div className='app-container'>
      <h2>Code-Oracle 🔮</h2>

      <IndexRepo />
      <Search />
    </div>
  );
}

export default App;
