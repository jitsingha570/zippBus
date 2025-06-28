import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/home";
import Navbar from "./Components/navbar";
import AddNewBus from "./Pages/addnew";

function App() {
  return (
    <Router>
      <Navbar />
     
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/addnew" element={<AddNewBus />} />
      </Routes>
    </Router>
  );
}

export default App;
