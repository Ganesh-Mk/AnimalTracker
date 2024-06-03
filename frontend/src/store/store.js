import { configureStore } from '@reduxjs/toolkit'

import userReducer from './userSlice'
import animalReducer from './animalSlice'
import mapReducer from './mapSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    animal: animalReducer,
    map: mapReducer,
  },
})

export default store
