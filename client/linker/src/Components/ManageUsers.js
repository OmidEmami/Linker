import React,{useState,useEffect} from 'react'
import axios from 'axios'
import LoadingComp from './LoadingComp';
import styles from "./ManageUsers.module.css"
import { notify } from './toast';
function ManageUsers() {
    const [isLoading , setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [getData, isGetData] = useState(false)
    useEffect(() => {
      
       const getDataServer = async()=>{
        try{
            setIsLoading(true)
           
            const response = await axios.get("http://localhost:3001/api/getusermanager")
            setData(response.data)
            isGetData(true)
            setIsLoading(false)
        }catch(error){
            console.log(error)
            setIsLoading(false)
        }
       }
       getDataServer();
    }, []);
    const handleChangeAccessType = async(index,e) =>{
      const updatedUsers = [...data];
      updatedUsers[index] = { ...updatedUsers[index], AccessType: e };
      setData(updatedUsers)
        
    }
    const saveData = async()=>{
      try{
        setIsLoading(true)
        const response = await axios.post("http://localhost:3001/api/changeaccesstype",{
          data : data
        })
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
    <h2>کاربران ثبت نام کرده</h2>
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