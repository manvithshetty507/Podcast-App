import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user:null
}

const userSlice = createSlice({
    name:'users',
    initialState:initialState,
    reducers:{
        setUser: (state,action) => {
            state.user = action.payload
        },
        clearUser: (state) => {
            state.user = null
        },
    },
})

export const { setUser, clearUser } = userSlice.actions

export default userSlice.reducer;