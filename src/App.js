import React, { useState } from 'react';
import FullSizeModal from './components/FullSizeModal';
import './App.css';

function App() {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div className="App">
      <button onClick={openModal} className="hello-button">Say Hello</button>
      <FullSizeModal showModal={showModal} closeModal={closeModal} />
    </div>
  );
}

export default App;
