import React from 'react'
import { useContext, useState, SyntheticEvent } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { UserErrors } from "../../models/error";
import { IShopContext, ShopContext } from "../../context/shop-context";

export const AuthPage = () => {
  return (
    <div className="auth">
      <Register />
      <Login />
    </div>
  );
};

export const Login = () => {
  const [_, setCookies] = useCookies(["access_token"]);
  const { setIsAuthenticated } = useContext<IShopContext>(ShopContext);

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    try {
      const result = await axios.post("http://localhost:3001/user/login", {
        username,
        password,
      });
  
      setCookies("access_token", result.data.token);
      window.localStorage.setItem("userID", result.data.userID);
      setIsAuthenticated(true);
      setUsername(result.data.username);
      console.log(username)
      navigate("/");
    } catch (err) {
      console.error("Login Error:", err);  
  
      let errorMessage: string = "Something went wrong";  
      if (err.response && err.response.data && err.response.data.type) {
        switch (err.response.data.type) {
          case UserErrors.USERNAME_ALREADY_EXISTS:
            errorMessage = "User already exists";
            break;
          case UserErrors.WRONG_CREDENTIALS:
            errorMessage = "Wrong username/password combination";
            break;
  
        }
      }
  
      alert("ERROR: " + errorMessage);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export const Register = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (event: SyntheticEvent ) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:3001/user/register", {
        username,
        password,
      });
      
      alert("Registration Completed! Now login.");
    } catch (err) {
      if (err.response.data.type === UserErrors.NO_USER_FOUND) {
        alert("ERROR: No user found");
      } else {
        alert("ERROR: Something went wrong");
      }
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};