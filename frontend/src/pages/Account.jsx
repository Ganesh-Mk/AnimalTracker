import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

const Account = () => {
  const userObj = useSelector((state) => state.user)

  return (
    <div>
      Name: {userObj.name ?? 'No'} <br />
      email: {userObj.email ?? 'No'} <br />
      pass: {userObj.password ?? 'No'} <br />
    </div>
  )
}

export default Account
