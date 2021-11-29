import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LogIn from './components/pages/LogIn';
import Home from './components/pages/Home';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import Calendar from './components/pages/Calendar';
import Header from './components/Header';
import MyProfil from './components/pages/MyProfil';
import ChangePassword from './components/pages/ChangePassword';

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<LogIn />} />
          <Route path="/home" element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/myAccount" element={<MyProfil />} />
          <Route path="/changePassword" element={<ChangePassword />} />
        </Routes>

        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </BrowserRouter>
    </>
  );
}

export default App;
