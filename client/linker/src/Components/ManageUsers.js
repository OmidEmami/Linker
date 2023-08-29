import React,{useState,useEffect} from 'react'
import axios from 'axios'
import LoadingComp from './LoadingComp';
import styles from "./ManageUsers.module.css"
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
    }, [data]);
    const handleChangeAccessType = async(index,e) =>{
        const temp = data;
        temp[index].AccessType = e;
        setData(temp)
        
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
            <td>{user.AccessType}<select required  value={user.AccessType} onChange={(e) => handleChangeAccessType(index, e.target.value)}>
                                        <option  enabled value={user.AccessType} >{user.AccessType}</option>
                                        <option value="editor">editor</option>
                        
                                    </select></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  )
}

export default ManageUsers