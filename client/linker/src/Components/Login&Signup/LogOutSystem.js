import React,{useEffect} from 'react'
import axios from "axios"
import { useHistory } from 'react-router-dom';
import { notify } from '../toast';
function LogOutSystem() {
    let history = useHistory();
    useEffect(() => {
        logoutsystem();
        
        }, []);
        
        const logoutsystem = async() => {
            await axios.delete('http://localhost:3001/api/logout');
            notify("با موفقیت از سیستم خارج شدید", "success")
            history.push("/");
            
        }
  return (
    <div>
      
    </div>
  )
}

export default LogOutSystem