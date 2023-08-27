import React,{useState} from "react";
import { useHistory,Link } from "react-router-dom";
import axios from "axios";
import { notify } from "../toast";
const Login =()=>{
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [errorUser, setErrorUser] = useState(false)
    const [errorPass, setErrorPass] = useState(false)
    const [finalError, setFinalError] = useState(false);
    let history = useHistory();
    const checkBlurUser = () =>{
        
        if(user === ""){
            setErrorUser(true)
        }else{
            setErrorUser(false)
        }

    }
    const checkBlurPass = () =>{
        if(pass === ""){
            setErrorPass(true)
        }else{
            setErrorPass(false)
        }
    }
    const login = async()=>{
        if(errorPass === false && errorUser === false && user !== "" && pass !== ""){
            setFinalError(false)
        try{
            await axios.post("https://gmhotel.ir/api/loginUser",{
                user : user,
                pass : pass
            })
            history.push("/home");
            notify( "با موفقیت وارد شدید", "success")
        }catch(error){
            setFinalError(true)
            notify( "خطا", "error")
        }
    }
    else{
        setFinalError(true)
        notify( "خطا", "error")
    }
    }
    return(
        <div style={{display:"flex", flexDirection:"column", padding:"10px", margin:"10px", direction:"rtl", alignItems:"center"}}>
                <label>نام کاربری</label>
                    
                <input type="text" value={user} onBlur={checkBlurUser} onChange={(e)=>setUser(e.target.value)} placeholder="نام کاربری" />
                
            {errorUser === true && <label>خطا</label>}<br></br>
                 <label>رمز عبور</label>

            <input type="password" value={pass} onBlur={checkBlurPass} onChange={(e)=>setPass(e.target.value)} placeholder="رمز عبور" />
                
                {errorPass === true && <label>خطا</label>}
                <br>
                </br>
                <button onClick={login}>ورود</button>
                {finalError && <label>خطا</label>}
                <Link to="/signup">حساب ندارم، ثبت نام میکنم</Link>
        </div>
    )
}
export default Login;