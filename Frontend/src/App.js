import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LogIn from './components/pages/LogIn';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import Calendar from './components/pages/Calendar';
import Header from './components/Header';
import MyProfil from './components/pages/MyProfil';
import ChangePassword from './components/pages/ChangePassword';
import TasksList from './components/TasksList';

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<LogIn />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/tasks" element={<TasksList />} />
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/myAccount" element={<MyProfil />} />
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
