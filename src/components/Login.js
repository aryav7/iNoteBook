import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = (props) => {
const [credentials,setCredentials] = useState({email:"", password:""})
let navigate = useNavigate();

    const handleSubmit = async (e)=>{
        e.preventDefault();
        const response = await fetch("http://[::1]:5000/api/auth/login"
        , {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
         body: JSON.stringify({email:credentials.email,password:credentials.password}),

          });
          const json = await response.json();
          console.log(json)
          if(json.success){
            // Save the authtoken and Redirect it
            localStorage.setItem('token',json.authToken)
            props.showAlert("Logged in Successfully", "success")
            navigate("/")
          }
          else{
            props.showAlert("Invalid details","danger")
          }
    }
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.tar.name]: e.target.value });
      };

  return (
    <div className='mt-3'>
      <h2>LOGIN</h2>
        <form onSubmit={handleSubmit}>
        <div className="mb-3">
    <label htmlFor="email" className="form-label">Email Address</label>
      <input onChange={onChange} type="email" className="form-control" id="email" value={credentials.email} name='email'/>
    </div>
  <div className="mb-3">
    <label htmlFor="password"  className="form-label">Password</label>
      <input autoComplete='on' value={credentials.password} onChange={onChange} type="password" className="form-control" name='password' id="password"/>
  </div>
  <button type="submit" className="btn-primary btn" >Submit</button>
  </form>
    </div>
  )
}

export default Login
