import React, { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [visible, setVisible] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault();
    if (userEmail === "" || userPassword === "") {
      alert("Fill all values correctly");
      return;
    }
    axios
      .post("http://localhost:3001/login", { userEmail, userPassword })
      .then((result) => {
        if (result.data === "Success") {
          console.log("All Done");
        } else {
            alert('Wrong credentials')
            return
        }
        setUserEmail("");
        setUserPassword("");
        navigate('/account')
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="loginContainer">
      <div className="card flex justify-content-center">
        <Button
          style={{ height: "2vw", width: "6vw", marginBottom: "1vw" }}
          className="custom-button"
          label="Login"
          icon="pi pi-user"
          onClick={() => setVisible(true)}
        />
        <Dialog
          visible={visible}
          modal
          onHide={() => setVisible(false)}
          content={({ hide }) => (
            <div
              className="flex flex-column px-8 py-5 gap-4"
              style={{
                borderRadius: "12px",
                backgroundImage:
                  "radial-gradient(circle at left top, var(--primary-400), var(--primary-700))",
              }}
            >
              <h1 style={{ textAlign: "center", color: "white" }}>Log in</h1>
              <div className="inline-flex flex-column gap-2">
                <label
                  htmlFor="useremail"
                  className="text-primary-50 font-semibold"
                >
                  Enter email
                </label>
                <InputText
                  id="useremail"
                  label="useremail"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="bg-white-alpha-20 border-none p-3 text-primary-50"
                ></InputText>
              </div>
              <div className="inline-flex flex-column gap-2">
                <label
                  htmlFor="userpassword"
                  className="text-primary-50 font-semibold"
                >
                  Enter password
                </label>
                <InputText
                  id="userpassword"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  label="userpassword"
                  className="bg-white-alpha-20 border-none p-3 text-primary-50"
                  type="password"
                ></InputText>
              </div>
              <div className="flex align-items-center gap-2">
                <Button
                  label="Submit"
                  onClick={handleLogin}
                  className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"
                ></Button>
                <Button
                  label="Cancel"
                  onClick={(e) => hide(e)}
                  text
                  className="p-3 w-full text-primary-100 border-1 border-white-alpha-30 hover:bg-white-alpha-10"
                ></Button>
              </div>
            </div>
          )}
        ></Dialog>
      </div>
    </div>
  );
}

export default Login;