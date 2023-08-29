
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./Components/Login&Signup/Login";
import SignUp from "./Components/Login&Signup/SignUp";
import GuestView from "./Components/GuestView";
import CheckOut from "./Components/CheckOut";
import MainDashboard from "./Components/MainDashboard";
import PdfGenerator from "./Components/PdfGenerator";
function App() {
  return (
   <>
   <BrowserRouter>
    <Switch>
    <Route exact path = "/pdf/:param">
    <PdfGenerator />
      </Route>
      <Route exact path = "/home">
    <MainDashboard />
      </Route>
      <Route exact path ="/checkout">
        <CheckOut />
      </Route>
      <Route exact path="/pay/:param">
        <GuestView />
        
      </Route>
    <Route exact path="/" >
    <Login />
      </Route>
      <Route exact path="/signup" >
    <SignUp />
      </Route>
      </Switch>
      </BrowserRouter>
      </>
  );
}

export default App;
