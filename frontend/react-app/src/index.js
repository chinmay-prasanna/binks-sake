import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Users/Login'
import SignUp from './Users/SignUp'
import CreateDirectory from "./Directory/CreateDirectory";
import Home from './Home'
import axios from "axios";

export default function App() {
  axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem('access');
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/directory" element={<CreateDirectory />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);