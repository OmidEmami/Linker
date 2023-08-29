import React,{useEffect,useState} from 'react'
import { PDFViewer } from '@react-pdf/renderer';
import MyDocument from './MyDocument';
import { useParams } from 'react-router-dom';
import axios from "axios"
export default function PdfGenerator() {
    const [reserveData, setReserveData] = useState("false")
    const { param } = useParams();
    useEffect(() => {
      const getDateForPdf = async()=>{
        try{
        const response = await axios.post("http://localhost:3001/api/findReserveForPdf", {
          ReserveKey : param
        })
        setReserveData(response.data)
        console.log(response.data)
        }catch(error){
          console.log(error)
        }
        
      }
      getDateForPdf();
      

      
    
    }, []);
  return (
    <div>
      <div style={{ width: '100vw', height: '100vh' }}>
        
        {reserveData === "false" ? null : <PDFViewer style={{ width: '100%', height: '100%' }}>
        <MyDocument data={reserveData}/>
      </PDFViewer>}
      
    </div>
    </div>
  )
}
