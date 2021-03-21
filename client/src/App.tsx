import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyUser } from './actions/userActions';
import NavBar from './components/NavBar';
import Routes from './components/routes/Routes';
import {ToastContainer} from 'react-toastify'
import { State } from './interfaces';

function App() {
  const dispatch = useDispatch();
  const {user} = useSelector((state: State) => state.user)

  useEffect(() => {
    dispatch(verifyUser(user.id));
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
