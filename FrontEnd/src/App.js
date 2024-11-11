import logo from './logo.svg';
import './App.css';
import Layout from './Components/Layout/Layout';
import Home from './Components/Home/Home';
import About from './Components/About/About';
import Faq from './Components/Faq/Faq';
import Feedback from './Components/Feedback/Feedback';
import Diagnostics from './Components/Diagnostics/Diagnostics';
import Register from './Components/Register/Register';
import Login from './Components/Login/Login';
import NotFound from './Components/NotFound/NotFound';

import {createBrowserRouter, RouterProvider} from 'react-router-dom';

function App() {

  let routers = createBrowserRouter([
    {path:'', element:<Layout/>, children:[
      {index:true, element:<Home/>},
      {path:'about', element:<About/>},
      {path:'faq', element:<Faq/>},
      {path:'feedback', element:<Feedback/>},
      {path:'diagnostics', element:<Diagnostics/>},
      {path:'login', element:<Login/>},
      {path:'register', element:<Register/>},
      {path:'*', element:<NotFound/>},
    ]}
  ])

  return <>
    <div className='main-content' style={{backgroundColor:'#76AB79'}}>
      <RouterProvider router={routers}></RouterProvider>
    </div>
  </>
}

export default App;
