import { React } from 'react';
import './App.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Snake from './components/Snake';
import NotFound from './components/NotFound';


const App = () => (

  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Snake />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  </BrowserRouter>

)

export default App;
