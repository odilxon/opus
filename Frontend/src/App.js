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
import './i18next';
import LabguageSite from './components/LabguageSite';
import AdminPage from './components/pages/AdminPage';
import ERRPage from './components/pages/ERRPage';
function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <LabguageSite className="languageSite" />
        <Routes>
          <Route path="/" element={<LogIn />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/tasks" element={<TasksList />} />
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/myAccount" element={<MyProfil />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<ERRPage />} />
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
