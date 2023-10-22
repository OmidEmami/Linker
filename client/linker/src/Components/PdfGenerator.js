import React,{useEffect,useState} from 'react'
import MyDocument from './MyDocument';
import { useParams } from 'react-router-dom';
import axios from "axios";
import jsPDF from 'jspdf';
export default function PdfGenerator() {
    const [reserveData, setReserveData] = useState("false")
    const { param } = useParams();
    const [totalPrice, setTotalPrice] = useState(0);
    // const generatePDF = async() => {
    //   const input = document.getElementById('componentToPDF'); // Replace with the ID of your component
    //   await document.fonts.ready;
    //   html2canvas(input, { scale: 1 }).then((canvas) => {
    //     const imgData = canvas.toDataURL('image/png');
    //     const pdf = new jsPDF('portrait','mm','a4');
    //     pdf.addImage(imgData, 'JPEG', 5, 5);
    //     pdf.save('component.pdf'); // Specify the desired file name
    //   });
    // }
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
       {/* <PDFViewer style={{ width: '100%', height: '100%' }}>  </PDFViewer> */}
        {reserveData === "false" ? null : 
        <MyDocument data={reserveData} price={totalPrice} id="componentToPDF" />
     }
     {/* <button onClick={generatePDF}>pdf</button> */}
      
    </div>
    </div>
  )
}
