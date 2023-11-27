import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Signup from './Signup';
import Login from './Login';
import Todo from './Todo/Todo';
import EmailVerify from './EmailVerify';

function App() {
  

  return (
    <div>
      <BrowserRouter >
        <Routes>
          
          <Route path ='/login' element={<Login/>}></Route>
          <Route path ='/register' element={<Signup/>}></Route>

          <Route path='/todo/:userId' element={<Todo/>}></Route>
          <Route path= '/:id/verify/:token'element={<EmailVerify/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App
