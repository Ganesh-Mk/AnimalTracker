import React, { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import axios from "axios";
import { InputText } from "primereact/inputtext";

function Signup() {
  const [visible, setVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/register', { userName, userEmail, userPassword })
      .then(res => {
        if (res.data) {
          localStorage.setItem("userName", userName);
          localStorage.setItem("userEmail", userEmail);
          setVisible(false); // Close dialog
          // Optionally, navigate to account page or update state to reflect the change
        }
      })
      .catch(err => console.log(err));
  }

  return (
    <div className="signupContainer">
      <Button
        style={{ height: '2vw', width: '6vw' }}
        className="custom-button"
        label="Signup"
        icon="pi pi-user"
        onClick={() => setVisible(true)}
      />
      <Dialog
        visible={visible}
        modal
        onHide={() => setVisible(false)}
      >
        <div className="flex flex-column px-8 py-5 gap-4" style={{ borderRadius: "12px", backgroundImage: "radial-gradient(circle at left top, var(--primary-400), var(--primary-700))" }}>
          <h1 style={{ textAlign: "center", color: "white" }}>Sign up</h1>
          <div className="inline-flex flex-column gap-2">
            <label htmlFor="username" className="text-primary-50 font-semibold">Enter name</label>
            <InputText
              id="username"
              onChange={(e) => setUserName(e.target.value)}
              label="Username"
              value={userName}
              className="bg-white-alpha-20 border-none p-3 text-primary-50"
            />
          </div>
          <div className="inline-flex flex-column gap-2">
            <label htmlFor="useremail" className="text-primary-50 font-semibold">Enter email</label>
            <InputText
              id="useremail"
              label="Useremail"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="bg-white-alpha-20 border-none p-3 text-primary-50"
            />
          </div>
          <div className="inline-flex flex-column gap-2">
            <label htmlFor="password" className="text-primary-50 font-semibold">Enter password</label>
            <InputText
              id="password"
              value={userPassword}
              label="Password"
              onChange={(e) => setUserPassword(e.target.value)}
              className="bg-white-alpha-20 border-none p-3 text-primary-50"
              type="password"
              required
            />
          </div>
          <div className="flex align-items-center gap-2">
            <Button
              label="Submit"
              onClick={handleSubmit}
              className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"
            />
            <Button
              label="Cancel"
              onClick={() => setVisible(false)}
              text
              className="p-3 w-full text-primary-100 border-1 border-white-alpha-30 hover:bg-white-alpha-10"
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default Signup;
