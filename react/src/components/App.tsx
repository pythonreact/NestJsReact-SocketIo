import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Form from './Form';
import Home from './Home';
import NavBar from './NavBar';
import Travel from './travel/Travel';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/travel" element={<Travel />} />
      </Routes>
      <Form />
      <ToastContainer limit={5} closeOnClick={true} pauseOnHover={true} className="!w-fit !max-w-xl !whitespace-pre-line" />
    </>
  );
};

export default App;
