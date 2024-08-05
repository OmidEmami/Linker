
import React, { useState } from 'react';

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
import Calendar from "./Components/Rack Hamam/Calendar";
import Yalda from "./Components/Yalda/Yalda.js";
import CrmComponent from "./Components/crm/CrmComponent";
import ReceptionLeadEntry from "./Components/crm/ReceptionSpecialComponents/ReceptionLeadEntry.js";
import ReportComponent from "./Components/crm/ReportComponent.js";
import LeadContext from "./context/LeadContext.js";
import WaitingListReserveByRec from './Components/crm/WaitingListReserveByRec.js';
import MiddleReserveConfView from './Components/MiddleWareReserve.js/MiddleReserveConfView.js';


function App() {
  const [phoneNumberSocket, setPhoneNumberSocket] = useState('');

  return (
   <>
    <LeadContext.Provider value={{ phoneNumberSocket, setPhoneNumberSocket }}>

   <div style={{minHeight: "95vh",
                display: "flex",
                  flexDirection: "column"}}>
   <BrowserRouter>
    <Switch>
      <Route exact path = "/waitinglist" >
        <WaitingListReserveByRec />
      </Route>
      <Route exact path="/report">
        <ReportComponent />
      </Route>
    <Route exact path="/receptionlead">
      <ReceptionLeadEntry />
    </Route>
    <Route exact path="/cal">
        <Calendar />
      </Route>
    <Route exact path="/crmphone">
      
      <CrmComponent />
      
    </Route>
    <Route exact path="/yalda">
        <Yalda />
      </Route>
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
      <Route exact path = "/mrcheck/:param">
        <MiddleReserveConfView />
      </Route>
      </Switch>
      </BrowserRouter>
      </div>
     <Footer />
     </LeadContext.Provider>
      </>
  );
}

export default App;
