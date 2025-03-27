import React, { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Spinner from "../../components/common/Spinner";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const { auth, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    handleRedirects();
  }, [auth]);

  const handleRedirects = () => {
    if (!loading) {
      if (auth === null) {
        navigate("/login");
      } else {
        navigate("/booking-tool");
      }
    }
  };

  return (
    <div className="h-full w-full flex justify-center items-center">
      <Spinner />
    </div>
  );
};

export default Landing;
