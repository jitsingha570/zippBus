import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/home";
import Navbar from "./Components/navbar";
import AddNewBus from "./Pages/addnew";
import RegisterPage from "./Pages/RegisterPage";
import LoginPage from "./Pages/LoginPage";

import ProfilePage from "./Pages/AccountPage";
import AccountPage from "./Pages/AccountPage";
import SearchBus from "./Pages/SearchBus";
import SearchBusByName from "./Pages/SearchBusByName";
import BusEditControl from "./Pages/BusEditControl";

import UpdateBus from "./Pages/UpdateBus";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/addnew" element={<AddNewBus />} />
        <Route path="/search" element={<SearchBus />} />
          <Route path="/searchBusByName" element={<SearchBusByName />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/account" element={<AccountPage/>} />
       
        <Route path="/update" element={<UpdateBus/>} />
        <Route path="/bus-edit" element={<BusEditControl />} />

      </Routes>
    </Router>
  );
}

export default App;
