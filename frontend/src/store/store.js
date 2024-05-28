import { configureStore } from '@reduxjs/toolkit'

import userReducer from './userSlice'
import animalReducer from './animalSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    animal: animalReducer,
  },
})

export default store
