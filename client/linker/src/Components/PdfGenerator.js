import React,{useEffect,useState} from 'react'
import MyDocument from './MyDocument';
import { useParams } from 'react-router-dom';
import axios from "axios";
import jsPDF from 'jspdf';
export default function PdfGenerator() {
    const [reserveData, setReserveData] = useState("false")
    const { param } = useParams();
    const [totalPrice, setTotalPrice] = useState(0);
    const [showPdf, setShowPdf] = useState(false);
    
    useEffect(() => {
      const getDateForPdf = async()=>{
        try{
        const response = await axios.post("http://localhost:3001/api/findReserveForPdf", {
          ReserveKey : param
        })
        if(response.data.length === 0){
          setShowPdf(false)

        }else{
          console.log(response.data)
          for(let i = 0 ; i < response.data.length ; i++){
            
              if(response.data[i].ExtraService === null){
                const ExtraService = "0"
                setTotalPrice((prevSum) => prevSum + ((parseInt(response.data[i].Price* (parseInt(response.data[i].AccoCount)))+ (parseInt(ExtraService)* (parseInt(response.data[i].AccoCount)))))  )
                console.log("omid1")
              }else{
               const ExtraService = response.data[i].ExtraService
                setTotalPrice((prevSum) => prevSum + ((parseInt(response.data[i].Price * (parseInt(response.data[i].AccoCount)))+ (parseInt(ExtraService)* (parseInt(response.data[i].AccoCount)))))  )
                
              }
              
            // setTotalPrice(prevstate => (prevstate + parseInt(response.data[i].Price * response.data[i].AccoCount)))
            // setTotalPrice((prevSum) => prevSum + (((parseInt(response.data[i].Price)+ parseInt(ExtraService)) * parseInt(response.data[i].AccoCount) * (parseInt(response.data[i].Percent))) / 100) )
            
          }
          setReserveData(response.data)
          setShowPdf(true)
        }
        
        
       
        }catch(error){
          setShowPdf(false)
        }
        
      }
      getDateForPdf();
      

      
    
    }, []);
  return (
    <div>
      <div >
       {/* <PDFViewer style={{ width: '100%', height: '100%' }}>  </PDFViewer> */}
        {reserveData === "false" ? null : 
        <MyDocument data={reserveData} price={totalPrice} id="componentToPDF" />
     }
     {showPdf === false && <h1 style={{display:"flex",justifyContent: "center",
                                    alignItems: "center"}}>در حال بارگذاری ووچر</h1>}
     {/* <button onClick={generatePDF}>pdf</button> */}
      
    </div>
    </div>
  )
}
