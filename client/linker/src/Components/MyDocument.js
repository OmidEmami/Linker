import React from 'react';
import { Document, Page, Text, View, StyleSheet,Image } from '@react-pdf/renderer';
import logo from "./ghasr.png"
import { Font } from '@react-pdf/renderer';
import persian from "./Yekan.ttf";
import moment from 'jalali-moment'
Font.register({ family: 'PersianFont', src: persian });
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    full: true,
    border : "1px solid black",
    display:"flex",
    flexDirection:"column",
    
    justifyContent:"center",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    border : "1px solid black",
    display:"flex",
    flexDirection:"column",
alignItems:"center",
justifyContent:"flex-start",
alignContent:"center"
  },
  table: { 
    display: "table", 
    width: "auto", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderRightWidth: 0, 
    borderBottomWidth: 0,
    marginTop:"10px"
  }, 
  tableRow: { 
    margin: "auto", 
    flexDirection: "row" 
  }, 
  tableCol: { 
    width: "20%", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0 
  }, 
  tableCell: { 
    margin: "auto", 
    marginTop: 5, 
    fontSize: 10 ,
    fontFamily: 'PersianFont'
  }
});

const MyDocument = ({ data }) => {
  moment.locale('fa');

    return (
      <Document
      author="Ghasr Monshi Hotel"
    keywords="Ghasr Monshi"
    subject="Reserve Confirmation"
    title="ووچر رزرو هتل قصرمنشی">
        <Page size="A4" orientation="portrait" style={styles.page}>
          <View style={styles.section}>
            <View style={{width:"10%", display:"flex"}}>
            <Image src={logo} />
            </View>
            <Text style={{ fontFamily: 'PersianFont', fontSize:"15" , margin:"10px" }}>ووچر رزرو هتل قصرمنشی</Text>
            <View style={{display:"flex", flexDirection:"row", alignContent:"space-between"}}>
            <Text style={{ fontFamily: 'PersianFont', fontSize:"15" , margin:"10px" }}>{data[0].FullName}نام مهمان : </Text>
            <Text style={{ fontFamily: 'PersianFont', fontSize:"15" , margin:"10px" }}>{data[0].Phone}شماره تماس : </Text>
            </View>
      <View style={styles.table}> 
        <View style={styles.tableRow}> 
        <View style={styles.tableCol}> 
            <Text style={styles.tableCell}>ردیف</Text>
          </View>
          <View style={styles.tableCol}> 
            <Text style={styles.tableCell}>نام اتاق</Text> 
          </View> 
          <View style={styles.tableCol}> 
            <Text style={styles.tableCell}>قیمت هر شب به ریال</Text> 
          </View> 
          <View style={styles.tableCol}> 
            <Text style={styles.tableCell}>تاریخ ورود و خروج</Text> 
          </View> 
          <View style={styles.tableCol}> 
            <Text style={styles.tableCell}>مدت اقامت</Text> 
          </View> 
        </View>
        <View style={styles.tableRow}>
          {data.length > 0 && data.map((info,index)=>(
            <>
            <View style={styles.tableCol} key={index} > 
            <Text style={styles.tableCell}>{index + 1}</Text> 
          </View>
            <View style={styles.tableCol} > 
            <Text style={styles.tableCell}>{info.RoomName}</Text> 
          </View> 
          <View style={styles.tableCol} key={index}> 
            <Text style={styles.tableCell}>{info.Price}</Text> 
          </View> 
          <View style={styles.tableCol} key={index}>
            <Text style={styles.tableCell}>{moment.from(info.CheckIn, 'en', 'YYYY-MM-DD').format('jYYYY/jMM/jDD')} - {moment.from(info.CheckOut, 'en', 'YYYY-MM-DD').format('jYYYY/jMM/jDD')}</Text> 
          </View>
          <View style={styles.tableCol} key={index}> 
            <Text style={styles.tableCell}>  شب  {info.AccoCount}</Text> 
          </View></>
          ))} 
          
           
        </View> 
      </View>
   
            
            
          </View>
        </Page>
      </Document>
    );
  };
  
export default MyDocument