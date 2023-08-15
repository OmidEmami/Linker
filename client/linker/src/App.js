
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./Components/Login&Signup/Login";
import SignUp from "./Components/Login&Signup/SignUp";
import Dashboard from "./Components/Dashboard";
import GuestView from "./Components/GuestView";
import CheckOut from "./Components/CheckOut";
import MainDashboard from "./Components/MainDashboard";
function App() {
  return (
   <>
   <BrowserRouter>
    <Switch>
      <Route exact path = "/home">
    <MainDashboard />
      </Route>
      <Route exact path ="/checkout">
        <CheckOut />
      </Route>
      <Route exact path="/pay/:param">
        <GuestView />
        
      </Route>
    <Route exact path="/login" >
    <Login />
      </Route>
      <Route exact path="/signup" >
    <SignUp />
      </Route>
      <Route exact path="/dashboard" >
    <Dashboard />
      </Route>
      </Switch>
      </BrowserRouter>
      </>
  );
}

export default App;
