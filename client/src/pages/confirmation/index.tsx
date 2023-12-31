import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (timer === 0) {
      navigate("/");
    }
  }, [timer, navigate]);

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div>
      <h1>Confirmation Page</h1>
      <p>Your order was successful!</p>
      <p>Redirecting to the home page in {timer} seconds...</p>
      <button className="confirm-button" onClick={handleGoHome}>Go to Home Page</button>
    </div>
  );
};

export default ConfirmationPage;
