import React,{useState,useEffect} from "react";
import jwt_decode from "jwt-decode";
import { useHistory,Link } from "react-router-dom";
import axios from "axios";
import { notify } from "../toast";
import LoadingComp from "../LoadingComp";
import Logo from "../../assests/logo.png"
const Login =()=>{
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [errorUser, setErrorUser] = useState(false)
    const [errorPass, setErrorPass] = useState(false)
    const [finalError, setFinalError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [token, setToken] = useState('');
    const [accessType, setAccessType] = useState('')
    const [expire, setExpire] = useState('');
    let history = useHistory();
    useEffect(() => {
        refreshToken();
        
    }, []);
 
    const refreshToken = async () => {
        try {
            setIsLoading(true)
            const response = await axios.get('http://localhost:3001/api/token');
            
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setEmail(decoded.email);
            setPhone(decoded.phone)
            setExpire(decoded.exp);
            setAccessType(decoded.accessType);
            setIsLoading(false)
            history.push("/home")
        } catch (error) {
            setIsLoading(false)
            if (error.response) {
                history.push("/");
            }
        }
    }
 
    const axiosJWT = axios.create();
 
    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
            setIsLoading(true)
            const response = await axios.get('http://localhost:3001/api/token');
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setPhone(decoded.phone)
            setEmail(decoded.email);
            setExpire(decoded.exp);
            setAccessType(decoded.accessType)
            setIsLoading(false)
        }
        return config;
    }, (error) => {
        setIsLoading(false)
        Promise.reject(error);
         return
    });
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
            setIsLoading(true)
        try{
            setIsLoading(true)
            await axios.post("http://localhost:3001/api/loginUser",{
                user : user,
                pass : pass
            })
            setIsLoading(false)
            history.push("/home");
            notify( "با موفقیت وارد شدید", "success")
        }catch(error){
            setIsLoading(false)
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
        <>
        {isLoading && <LoadingComp />}
        <div style={{width:"100%", border:"solid",borderColor:"#D2AF6F", borderTopWidth: "0",
    borderRightWidth:"0",
    borderBottomWidth: "2px",
    borderLeftWidth: "0",
    display:"flex",
    flexDirection:"column",
   justifyContent:"center",
    alignItems:"center",

}}>
    <img width="5%" src={Logo} alt="logo ghasr" style={{margin:"2px"}} />
    <h4>ارسال لینک قصرمنشی</h4>
</div>
        <div style={{display:"flex", flexDirection:"column",
         padding:"10px", margin:"10px"
          ,direction:"rtl", alignItems:"center",
           backgroundColor:"#D2AF6F",
           borderRadius:"5px"
           }}>
            <h3>ورود به سیستم</h3>
                <label>نام کاربری</label>
                    
                <input style={{borderRadius:"5px", border:"none"}} type="text" value={user} onBlur={checkBlurUser} onChange={(e)=>setUser(e.target.value)} placeholder="نام کاربری" />
                
            {errorUser === true && <label>خطا</label>}<br></br>
                 <label>رمز عبور</label>

            <input style={{borderRadius:"5px", border:"none"}} type="password" value={pass} onBlur={checkBlurPass} onChange={(e)=>setPass(e.target.value)} placeholder="رمز عبور" />
                
                {errorPass === true && <label>خطا</label>}
                <br>
                </br>
                <button style={{borderRadius:"5px"}} onClick={login}>ورود</button>
                {finalError && <label>خطا</label>}
                <Link to="/signup">حساب ندارم، ثبت نام میکنم</Link>
        </div>
        
        </>
    )
}
export default Login;