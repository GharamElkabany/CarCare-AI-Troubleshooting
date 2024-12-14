import './App.css';
import Layout from './Components/Layout/Layout';
import Home from './Components/Home/Home';
import About from './Components/About/About';
import Faq from './Components/Faq/Faq';
import Feedback from './Components/Feedback/Feedback';
import Diagnostics from './Components/Diagnostics/Diagnostics';
import Register from './Components/Register/Register';
import Login from './Components/Login/Login';
import Welcome from './Components/Welcome/Welcome';
import Profile from './Components/Profile/Profile';
import ChangePassword from './Components/ChangePassword/ChangePassword';
import NotFound from './Components/NotFound/NotFound';

import {createBrowserRouter, RouterProvider} from 'react-router-dom';


function App() {
  const auth = localStorage.getItem('token') ? true : false; 
  const role = localStorage.getItem('role');

  let routers = createBrowserRouter([
    {path:'', element:<Layout role={role}/>, children:[
      {index:true, element:<Welcome/>},
      {path:'about', element:<About/>},
      {path:'faq', element:<Faq/>},
      {path:'feedback', element:<Feedback/>},
      {path:'diagnostics', element:<Diagnostics/>},
      {path:'login', element:<Login/>},
      {path:'register', element:<Register/>},
      {path:'home',element:<Home/>},
      {path:'profile',element:<Profile/>},
      {path:'changePassword',element:<ChangePassword/>}
    ]},
    {path:'*', element:<NotFound/>}
  ]);

  return <>
    <div className='main-content' style={{backgroundColor:'#76AB79'}}>
      <RouterProvider router={routers}></RouterProvider>
    </div>
  </>
}

export default App;
