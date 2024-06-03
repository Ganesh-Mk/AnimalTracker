import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  centerPosition: [15.892826703895803, 74.53231051009787],
  ownerLocation: [15.893782329637874, 74.5314625373903],
  markers: [],
  shape: 'circle',
  // owner: '',
  activeTab: 0,
  nearestBorder: 600,
  mainBorder: 750,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCenterPositionSlice: (state, action) => {
      state.centerPosition = action.payload
    },
    setOwnerLocationSlice: (state, action) => {
      state.ownerLocation = action.payload
    },
    setMarkersSlice: (state, action) => {
      state.markers = action.payload
    },
    setShapeSlice: (state, action) => {
      state.shape = action.payload
    },
    // setOwner: (state, action) => {
    //   state.owner = action.payload
    // },
    setNearestBorderSlice: (state, action) => {
      state.nearestBorder = action.payload
    },
    setMainBorderSlice: (state, action) => {
      state.mainBorder = action.payload
    },
    setActiveTabSlice: (state, action) => {
      state.activeTab = action.payload
    },
  },
})

export const {
  setCenterPositionSlice,
  setOwnerLocationSlice,
  setMarkersSlice,
  setShapeSlice,
  // setOwnerSlice,
  setNearestBorderSlice,
  setMainBorderSlice,
} = userSlice.actions
export default userSlice.reducer
