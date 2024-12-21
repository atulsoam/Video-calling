/* eslint-disable no-unused-vars */
import React from 'react';
import {Routes,Route} from "react-router-dom"
import Lobby from './pages/lobby';
import Room from './pages/Room';

const App = () => {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Lobby/>}/>
        <Route path='/room/:roomId' element={<Room/>}/>

      </Routes> 
    </div>
  )
};

export default App;
