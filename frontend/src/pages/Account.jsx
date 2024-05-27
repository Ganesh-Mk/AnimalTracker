import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

const Account = () => {
  const userObj = useSelector((state) => state.user)

  const [name, setName] = useState('-')
  const [email, setEmail] = useState('-')
  const [password, setPassword] = useState('-')

  useEffect(() => {
    setName(localStorage.getItem('name'))
    setEmail(localStorage.getItem('email'))
    setPassword(localStorage.getItem('password'))
  })

  return (
    <div>
      Name: {name} <br />
      email: {email} <br />
      pass: {password} <br />
    </div>
  )
}

export default Account
