import { createSlice } from "@reduxjs/toolkit";
import { IUserProfile } from "../../models/user";
const initialState = {
    user : null as IUserProfile | null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUserProfile: (_state, action) => {
            return {
                user : action.payload,
            };
        },
        getUserProfile: (state) => {
            return state;
        },
        removeUserProfile: () => {
            localStorage.removeItem('access-token');
            localStorage.removeItem('refresh-token');
            return initialState;
        }
    },
});

export const { setUserProfile, getUserProfile, removeUserProfile } = authSlice.actions;
export default authSlice.reducer;

