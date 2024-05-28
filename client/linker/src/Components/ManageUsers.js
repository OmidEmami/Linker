import React,{useState,useEffect} from 'react'
import axios from 'axios'
import LoadingComp from './LoadingComp';
import styles from "./ManageUsers.module.css"
import { notify } from './toast';
import jwt_decode from "jwt-decode";
import { useHistory } from "react-router-dom";
function ManageUsers() {
    const [isLoading , setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [getData, isGetData] = useState(false);
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');

    const history = useHistory();
    useEffect(() => {
      refreshToken();
      if(token !== ''){
        getDataServer();
      }
      
       async function getDataServer() {
        try {
          setIsLoading(true);

          const response = await axios.get("https://gmhotel.ir/api/getusermanager", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setData(response.data);
          isGetData(true);
          setIsLoading(false);
        } catch (error) {
         
          setIsLoading(false);
        }
      }
       
    }, [token]);
    const refreshToken = async () => {
      try {
        
          const response = await axios.get('https://gmhotel.ir/api/token');
          
          setToken(response.data.accessToken);
          const decoded = jwt_decode(response.data.accessToken);
          setExpire(decoded.exp);
       
      } catch (error) {
        
          if (error.response) {
              history.push("/");
          }
      }
  }

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        
          const response = await axios.get('https://gmhotel.ir/api/token');
          config.headers.Authorization = `Bearer ${response.data.accessToken}`;
          setToken(response.data.accessToken);
          const decoded = jwt_decode(response.data.accessToken);
          setExpire(decoded.exp);
      }
      return config;
  }, (error) => {
      
       Promise.reject(error)
       return
  });
    const handleChangeAccessType = async(index,e) =>{
      const updatedUsers = [...data];
      updatedUsers[index] = { ...updatedUsers[index], AccessType: e };
      setData(updatedUsers)
        
    }
    const saveData = async()=>{
      try{
        setIsLoading(true)
        const response = await axios.post("https://gmhotel.ir/api/changeaccesstype",{
          data : data
        },{
          headers:{
            Authorization: `Bearer ${token}`
          }
        }
        )
        notify( "موفق", "success")
        setIsLoading(false)
      }catch(error){
        
        setIsLoading(false)
        notify( "نا موفق", "error")
      }
    }
  return (
    <div>
        {isLoading && <LoadingComp />}
    <h2 style={{direction:"rtl"}}>کاربران ثبت نام کرده</h2>
    <table className={styles.userTable}>
      <thead>
        <tr>
          <th>نام</th>
          <th>ایمیل/یوزر</th>
          <th>موبایل</th>
          <th>وضعیت دسترسی</th>
        </tr>
      </thead>
      <tbody>
        {getData && data.map((user,index) => (
            <tr key={index}>
            <td>{user.FullName}</td>
            <td>{user.UserName}</td>
            <td>{user.Phone}</td>
            <td><select required  value={user.AccessType} onChange={(e) => handleChangeAccessType(index, e.target.value)}>
                                        <option  enabled value="none" >نقش کاربر را انتخاب کنید</option>
                                        <option value="editor">editor</option>
                                        <option value="admin">admin</option>
                                        <option value="reception">reception</option>
                                        <option value="reservation">reservation</option>
                        
                                    </select></td>
          </tr>
        ))}
      </tbody>
    </table>
    <button onClick={saveData}>ذخیره</button>
  </div>
  )
}

export default ManageUsers