
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./Components/Login&Signup/Login";
import SignUp from "./Components/Login&Signup/SignUp";
import GuestView from "./Components/GuestView";
import CheckOut from "./Components/CheckOut";
import MainDashboard from "./Components/MainDashboard";
import PdfGenerator from "./Components/PdfGenerator";
import MeCaLinker from "./Components/Send Menu & Catalog links/MeCaLinker";
import TestMove from "./Components/TestMove";
import ForAmir from "./Components/Send Menu & Catalog links/ForAmir";
import Footer from "./Components/Footer";
import GetLeads from "./Hamam/GetLeads";
import RequestFollowUp from "./Hamam/RequestFollowUp";



function App() {
  return (
   <>
   <div style={{minHeight: "95vh",
                display: "flex",
                  flexDirection: "column"}}>
   <BrowserRouter>
    <Switch>
    <Route exact path="/followup">
        <RequestFollowUp />
      </Route>
    <Route exact path="/hamam">
        <GetLeads />
      </Route>
    <Route exact path="/foramir">
        <ForAmir />
      </Route>
    <Route exact path="/testmove">
        <TestMove />
      </Route>
      <Route exact path="/sendlinks">
        <MeCaLinker />
      </Route>
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
      </div>
     <Footer />
      </>
  );
}

export default App;
