import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  animalName: "",
  animalLat: "",
  animalLong: "",
  animalRest: "",
  animalMeter: "",
  animalKm: "",
  animalWalk: "",
  animalTime:"",
  animalDate:"",
  animalOutside:""
};

export const animalSlice = createSlice({
  name: "animal",
  initialState,
  reducers: {
    setAnimalName: (state, action) => {
      state.animalName = action.payload;
    },
    setAnimalLat: (state, action) => {
      state.animalLat = action.payload;
    },
    setAnimalLong: (state, action) => {
      state.animalLong = action.payload;
    },
    setAnimalMeter: (state, action) => {
      state.animalMeter = action.payload;
    },
    setAnimalKm: (state, action) => {
      state.animalKm = action.payload;
    },
    setAnimalDate: (state, action) => {
        state.animalDate = action.payload;
      },
      setAnimalTime: (state, action) => {
        state.animalTime = action.payload;
      },
    setAnimalRest: (state, action) => {
      state.animalRest = action.payload;
    },
    setAnimalOutside: (state, action) => {
        state.animalOutside = action.payload;
      },
    setAnimalWalk: (state, action) => {
      state.animalWalk = action.payload;
    },
  },
});

export const {
  setAnimalName,
  setAnimalLat,
  setAnimalLong,
  setAnimalMeter,
  setAnimalKm,
  setAnimalDate,
  setAnimalTime,
  setAnimalRest,
  setAnimalWalk,
  setAnimalOutside,
} = animalSlice.actions;

export default animalSlice.reducer;
