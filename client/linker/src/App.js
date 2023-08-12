
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./Components/Login&Signup/Login";
import SignUp from "./Components/Login&Signup/SignUp";
import Dashboard from "./Components/Dashboard";
import GuestView from "./Components/GuestView";
function App() {
  return (
   <>
   <BrowserRouter>
    <Switch>
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
