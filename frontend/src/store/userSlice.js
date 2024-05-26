import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  id: '',
  name: '',
  email: '',
  password: '',
  userImage: '',
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setId: (state, action) => {
      state.id = action.payload
    },
    setName: (state, action) => {
      state.name = action.payload
    },
    setEmail: (state, action) => {
      state.email = action.payload
    },
    setPassword: (state, action) => {
      state.password = action.payload
    },
    setUserImage: (state, action) => {
      state.userImage = action.payload
    },
  },
})

export const {
  setId,
  setName,
  setEmail,
  setPassword,
  setUserImage,
} = userSlice.actions
export default userSlice.reducer
