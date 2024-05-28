import React,{useEffect,useState} from 'react'
import axios from "axios"
import { useHistory } from 'react-router-dom';
import { notify } from '../toast';
import LoadingComp from '../LoadingComp';
function LogOutSystem() {
    let history = useHistory();
    const [isLoading, setIsloading] = useState(false)
    useEffect(() => {
        logoutsystem();
        
        }, []);
        
        const logoutsystem = async() => {
            try{
              setIsloading(true)
              await axios.delete('https://gmhotel.ir/api/logout');
              notify("با موفقیت از سیستم خارج شدید", "success")
              history.push("/");
              setIsloading(false)
            }catch(error){
              notify('خطا','error')
              setIsloading(false)
            }
            
            
        }
  return (
    <div>
      {isLoading && <LoadingComp />}
    </div>
  )
}

export default LogOutSystem
