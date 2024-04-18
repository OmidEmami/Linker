import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';

function ReportComponent() {
 
  const [data, setData] = useState([]);

 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);




  
  useEffect(() => {
    
    axios.get('http://localhost:3001/api/getCallsReport')
      .then(response => {
        setData(response.data); 
        setIsLoading(false); 
      })
      .catch(error => {
        setError(error.message); 
        setIsLoading(false); 
      });
  }, []); 

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  const sendEmail = async() =>{
    try{
      const response = await axios.get("http://localhost:3001/api/sendtestemail")
      console.log(response)
    }
      catch(error){
        console.log(error)
      }
    }
  return (
    <div>
      {/* <Button onClick={sendEmail}>test</Button> */}
      <h1>Report Data</h1>
      <table>
        <thead>
          <tr>
            <th>Phone</th>
            <th>Name</th>
            <th>RequestType</th>
            <th>Result</th>
            <th>Date</th>
            <th>Section</th>
            <th>Source</th>
            <th>Registed User</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.Phone}</td>
              <td>{item.FullName}</td>
              <td>{item.RequestType}</td>
              <td>{item.Result}</td>
              <td>{item.LastCall}</td>
              <td>{item.Section}</td>
              <td>{item.custumerSource}</td>
              <td>{item.RegUser}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportComponent;
