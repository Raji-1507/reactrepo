import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios' 
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

function Signup(){
    const[email,setEmail] = useState()
    const[password,setPassword] = useState()
    const[msg,setMsg] = useState()
    const[error,setError] = useState()
    const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:3001/register";
			const { data: res } = await axios.post(url, {email,password});
			setMsg(res.message);
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};
    return (
        <div className="d-flex justify-content-center align-item-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded w-25">
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email"></label>
                        <strong>Email</strong>
                        <input type="email"
                        placeholder="Enter Email"
                        autoComplete="off"
                        name = "email"
                        onChange={(e) =>setEmail(e.target.value)}
                        className="form-control rounded-0"/>

                    </div>
                    <div className="mb-3">
                        <label htmlFor="password"></label>
                        <strong>Password</strong>
                        <input type="password"
                        placeholder="Enter password"
                        onChange={(e)=> setPassword(e.target.value)}
                        name = "password"
                        className="form-control rounded-0" />
                    </div>
                    {msg && <div className={styles.success_msg}>{msg}</div>}
                    <div></div>
                    <button type="submit" className="btn btn-success w-100 rounded-0">
                        Register
                    </button>
                </form>
                <p>Already Have an Account</p>
                <Link to="/login" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">Login</Link>
            </div>

        </div>
    );
}
export default Signup;