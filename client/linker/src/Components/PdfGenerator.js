import React,{useEffect,useState} from 'react'
import { PDFViewer } from '@react-pdf/renderer';
import MyDocument from './MyDocument';
import { useParams } from 'react-router-dom';
import axios from "axios"
export default function PdfGenerator() {
    const [reserveData, setReserveData] = useState("false")
    const { param } = useParams();
    const [totalPrice, setTotalPrice] = useState(0)
    useEffect(() => {
      const getDateForPdf = async()=>{
        try{
        const response = await axios.post("https://gmhotel.ir/api/findReserveForPdf", {
          ReserveKey : param
        })
        for(let i = 0 ; i < response.data.length ; i++){
          setTotalPrice(prevstate => (prevstate + parseInt(response.data[i].Price)))
        }
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
        <MyDocument data={reserveData} price={totalPrice}/>
      </PDFViewer>}
      
    </div>
    </div>
  )
}
