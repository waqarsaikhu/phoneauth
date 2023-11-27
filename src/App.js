import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import UserDetails from "./components/userDetails";
import UserList from "./components/userList";

import { UserContext } from "./context/UserContext";
import { useState } from "react";

const App = () => {
  const [userData, setUserData] = useState(null);
  return (
    <>
      <Router>
        <UserContext.Provider value={{ userData, setUserData }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="userDetails" element={<UserDetails />} />
            <Route path="userList" element={<UserList />} />
          </Routes>
        </UserContext.Provider>
      </Router>
    </>
  );
};

export default App;
