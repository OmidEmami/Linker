import React, { createContext, useState } from 'react';

const LeadContext = createContext({
  phoneNumberSocket: [],
  setPhoneNumberSocket: () => {},
  removePhoneNumber: () => {}
});

export const LeadContextProvider = ({ children }) => {
  const [phoneNumberSocket, setPhoneNumberSocket] = useState([]);

  const removePhoneNumber = (phone) => {
    setPhoneNumberSocket(prev => prev.filter(item => item.phone !== phone));
  };

  return (
    <LeadContext.Provider value={{ phoneNumberSocket, setPhoneNumberSocket, removePhoneNumber }}>
      {children}
    </LeadContext.Provider>
  );
};

export default LeadContext;
