import { createSlice } from "@reduxjs/toolkit";
import { IUserProfile } from "../../models/User";
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
        },
        addPointsToWallet: (state, action) => {
            if (state.user) {
                state.user.wallet += action.payload;
            }
        }
    },
});

export const { setUserProfile, getUserProfile, removeUserProfile,addPointsToWallet } = authSlice.actions;
export default authSlice.reducer;

