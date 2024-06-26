import React,{useState} from "react";
import axios from "axios"
import { notify } from "../toast";
import Modal from 'react-modal';
import 'react-toastify/dist/ReactToastify.css';
import LoadingComp from "../LoadingComp";
import { Link } from "react-router-dom";
import Logo from "../../assests/logo.png"
const SignUp = () =>{
    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
      }; 
    const [isLoading, setIsLoading] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [pass, setPass] = useState('');
    const [rePass ,setRePass] = useState('');
    const [showPassError, setShowPassError]= useState(false);
    const [errorfullName, setFullNameError] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorPhone, setErrorPhone] = useState(false);
    const [errorPass, setErrorPass] = useState(false);
    const [errorRePass, setErrorRePass] = useState(false);
    const [errorRegexEmail, setErrorRegexEmail] = useState(false);
    const [errorRegexPass, setErrorRegexPass] = useState(false);
    const [errorRegexPhone, setErrorRegexPhone] = useState(false);
    const [emptyError, setEmptyError] = useState(false);
    const [initialPopup, setInitialPopup] = useState(false)
    Modal.setAppElement('#root');
    const [error, setError] = useState({
        name : false,
        pass : false,
        rePass : false,
        email : false,
        phone: false
    })
    const confirm = async() =>{
        
        if (fullName === ''||
            email === ''||
            phone === ''||
            pass === ''||
            rePass === ''){
                setEmptyError(true)
                notify( "خطا", "error")
            }else{
                if(error.name === true && error.pass === true && error.rePass === true && error.email === true && error.phone === true){
                    
                    setEmptyError(false)
                    try{
                        setIsLoading(true)
                            const response = await axios.post('http://localhost:3001/api/newuser',{
                                fullName  : fullName,
                                email : email,
                                phone : phone,
                                pass : pass
                            })
                            if(response.data === "success"){
                                setIsLoading(false)
                                notify( "ثبت نام با موفقیت انجام شد", "success")
                                setInitialPopup(true)
                            }else{
                                setIsLoading(false)
                                notify( "خطا", "error")
                            }
                        }catch(error){
                            setIsLoading(false)
                            notify( "خطا", "error")
                        }
                }else{
                    
                    setEmptyError(true)
                    notify( "خطا", "error")
                }
            }
        // 
    }
    const checkPass =(e)=>{
        setRePass(e);
        if(e !== pass){
            setShowPassError(true);
            setError((prevError) => ({
                ...prevError,
                rePass: false,
              }));

        }else{
            
            setShowPassError(false);
            setError((prevError) => ({
                ...prevError,
                rePass: true,
              }));
            
        }
    }
    const fullNameBlur =()=>{
        if(fullName === ''){
            setFullNameError(true);
            setError((prevError) => ({
                ...prevError,
                name: false,
              }));
        }else{
            setFullNameError(false);
            setError((prevError) => ({
                ...prevError,
                name: true,
              }));
        }
    }
    const phoneBlur = () =>{
        const phoneRegex = /^0\d{10}$/;
        if(phone === ''){
            setErrorPhone(true)
            setErrorRegexPhone(false)
            setError((prevError) => ({
                ...prevError,
                phone: false,
              }));
        }else{
            if(phoneRegex.test(phone)){
            setErrorPhone(false)
            setErrorRegexPhone(false)
            setError((prevError) => ({
                ...prevError,
                phone: true,
              }));
            }else{
                setErrorPhone(false)
                setErrorRegexPhone(true)
                setError((prevError) => ({
                    ...prevError,
                    phone: false,
                  }));
            }
        }
    }
    const emailBlur = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(email === ''){
            setErrorEmail(true)
            setErrorRegexEmail(false)
            setError((prevError) => ({
                ...prevError,
                email: false,
              }));
        }else{
            if(emailRegex.test(email)){
            setErrorEmail(false)
            setErrorRegexEmail(false)
            setError((prevError) => ({
                ...prevError,
                email: true,
              }));
            }else{
                setErrorEmail(false)
                setErrorRegexEmail(true)
                setError((prevError) => ({
                    ...prevError,
                    email: false,
                  }));
            }
        }
    }
    const passBlur = () =>{
        const passwordRegex = /^(?=.*[A-Za-z]{4,})(?=.*\d).+$/;
        if(pass === ''){
            setErrorPass(true)
            setErrorRegexPass(false)
            setError((prevError) => ({
                ...prevError,
                pass: false,
              }));
        }else{
            if(passwordRegex.test(pass)){
            setErrorPass(false)
            setErrorRegexPass(false)
            setError((prevError) => ({
                ...prevError,
                pass: true,
              }));
            }else{
                setErrorPass(false)
                setErrorRegexPass(true)
                setError((prevError) => ({
                    ...prevError,
                    pass: false,
                  }));
            }
        }
    }
    const rePassBlur = () =>{
        const passwordRegex = /^(?=.*[A-Za-z]{4,})(?=.*\d).+$/;
        if(rePass === ''){
            setErrorRePass(true)
            setShowPassError(false)
        }else{
            setErrorRePass(false)
        }
    }
    return(
        <>
        {isLoading && <LoadingComp />}
        <Modal
        isOpen={initialPopup}
        onRequestClose={()=>setInitialPopup(false)}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div style={{direction:"rtl"}}>
            <p>ثبت نام شما با موفقیت انجام شد
                 بعد از تایید ثبت نام به شما اطلاع رسانی می شود
                  و می توانید بانام کاربری و رمز عبور انتخابی وارد پنل شوید</p>
      </div>
      </Modal>
      
        <div style={{display:"flex", flexDirection:"column", alignItems:"center", direction:"rtl",padding:"10px",margin:"10px"}}> 
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
         width:"100%",margin:"10px"
          ,direction:"rtl", alignItems:"center",
           backgroundColor:"#D2AF6F",
           borderRadius:"5px"
           }}>
            <h3>ثبت نام</h3>
            <label>
                نام کامل</label>
                <input style={{borderRadius:"5px", border:"none"}} required type="text" value={fullName} onBlur={fullNameBlur} onChange={(e)=>setFullName(e.target.value)} />
            
            {errorfullName && <label>لطفا نام خود را وارد کنید</label>}
            <label> ایمیل</label>
                <input  style={{borderRadius:"5px", border:"none", direction:"ltr"}} required type="text" value={email} onBlur={emailBlur} onChange={(e)=>setEmail(e.target.value)} />
            
            {errorEmail && <label>لطفا ایمیل خود را وارد کنید</label>}
            {errorRegexEmail && <label>ایمیل معتبر نیست</label>}
            <label> موبایل  </label>
              <input style={{borderRadius:"5px", border:"none"}} required type="text" value={phone} onBlur={phoneBlur} onChange={(e)=>setPhone(e.target.value)} />
           
            {errorPhone && <label>لطفا شماره موبایل خود را وارد کنید</label>}
            {errorRegexPhone && <label>شماره موبایل معتبر نیست</label>}
            <label>رمز عبور</label>
                <input style={{borderRadius:"5px", border:"none"}} type="password" value={pass} onBlur={passBlur} onChange={(e)=>setPass(e.target.value)} />
            
            {errorPass && <label>لطفا رمز عبور خود را وارد کنید</label>}
            {errorRegexPass && <label>رمز عبور باید شامل حداقل 4 حرف و یک عدد باشد</label>}
            <label>تکرار رمز عبور</label>{showPassError && <label>تکرار رمز عبور صحیح نیست</label>}
                <input style={{borderRadius:"5px", border:"none"}}  required type="password" value={rePass} onBlur={rePassBlur} onChange={(e)=>checkPass(e.target.value)} />
            
            {errorRePass && <label>لطفا رمز عبور خود را تکرار کنید</label>}
            {emptyError && <label>لطفا همه موارد را به درستی تکمیل کنید</label>}
            <button style={{margin:"10px"}} onClick={confirm}>ثبت نام</button> <Link to="/">ورود</Link>
            </div>
        </div>
        </>
    )
}
export default SignUp;