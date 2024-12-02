import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationForm from "./inscription/RegistrationForm";
import ConfirmationPage from "./inscription/ConfirmationPage";
import Homepage from "./home/HelloWorld";
import Login from "./login/Login";
import ResetPass from "./login/ResetPass";
import CompteValide from "./Interface/Tovalidate"; // Import AddForm here
import EditUserForm from "./Interface/EditUserForm";
import Dashboard from "./Interface/dashboard";
import AddForm from "./Interface/AddForm"; // Import AddForm here
import ComptenotValide from "./Interface/bloque";


import CallsList from "./Interface/CRUD calls/calls_list"
import AddCall from "./Interface/CRUD calls/add_call"
import EditCall from "./Interface/CRUD calls/edit_calls"
import ProtectedLayout from "./utils/ProtectedLayout";
import UserTable from './Interface/userlist';

const onLogout = () => {
  // Clear tokens from localStorage and sessionStorage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
};


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/sign-in" element={<Login />} />
        <Route path="/" element={<Homepage />}  />
        <Route path="/Registration" element={<RegistrationForm />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/resetpassword" element={<ResetPass />} />
        <Route path='/dashboard' element={<Dashboard onLogout={onLogout}/>} />
        <Route path="/add" element={<ProtectedLayout requiredRole={["ROLE_MANAGER","ROLE_CONTROLLER"]}><AddForm onLogout={onLogout}/></ProtectedLayout>} /> 
        <Route path="/bloque" element={<ProtectedLayout requiredRole={"ROLE_MANAGER"}><ComptenotValide onLogout={onLogout}/></ProtectedLayout>} />
        <Route path="/Tovalidate" element={<ProtectedLayout requiredRole={"ROLE_MANAGER"}><CompteValide onLogout={onLogout} /></ProtectedLayout>} />
        <Route path="/users" element={<ProtectedLayout requiredRole={["ROLE_MANAGER","ROLE_CONTROLLER"]}><UserTable /></ProtectedLayout>} />
        <Route path="/edit-user/:id" element={<ProtectedLayout requiredRole={["ROLE_EMPLOYEE", "ROLE_MANAGER", "ROLE_CONTROLLER"]}><EditUserForm onLogout={onLogout}/></ProtectedLayout>} />
        <Route path="/call_list" element={<ProtectedLayout requiredRole={["ROLE_EMPLOYEE"]}> <CallsList /></ProtectedLayout>} />
        <Route path="/add_call" element={<ProtectedLayout requiredRole={["ROLE_EMPLOYEE"]}><AddCall /></ProtectedLayout>} />
        <Route path="/edit_call/:id" element={<ProtectedLayout requiredRole={["ROLE_EMPLOYEE"]}><EditCall /></ProtectedLayout>} />
        </Routes>
    </Router>
  );
}

export default App;
