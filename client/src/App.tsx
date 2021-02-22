import React, {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { loadUser } from './actions/userActions';
import NavBar from './components/NavBar';
import Routes from './components/routes/Routes';
import {ToastContainer} from 'react-toastify'


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser())
  }, [])

  return (
    <React.Fragment>
      <NavBar/>

      <Routes/>

      <ToastContainer position="bottom-right" />
    </React.Fragment>
  );
}

export default App;
