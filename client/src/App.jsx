import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/home";
import Navbar from "./Components/navbar";
import AddNewBus from "./Pages/addnew";
import RegisterPage from "./Pages/RegisterPage";
import LoginPage from "./Pages/LoginPage";

import ProfilePage from "./Pages/AccountPage";
import AccountPage from "./Pages/AccountPage";
import SearchBus from "./Pages/SearchBus";


function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/addnew" element={<AddNewBus />} />
        <Route path="/search" element={<SearchBus />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/account" element={<AccountPage/>} />
        

      </Routes>
    </Router>
  );
}

export default App;
