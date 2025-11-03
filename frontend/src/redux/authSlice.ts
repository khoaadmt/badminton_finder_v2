import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        login: {
            currentUser: null,
            isFetching: false,
            error: false,
        },
        register: {
            isFetching: false,
            error: false,
        },
        logOut: {
            isFetching: false,
            error: false,
        },
        mgs: null,
    },
    reducers: {
        setFetchingState: (state) => {
            state.login.isFetching = true;
        },
        setSuccessState: (state, actions) => {
            state.login.isFetching = false;
            state.login.currentUser = actions.payload;
            state.login.error = false;
            state.mgs = actions.payload.message;
        },
        setFailureState: (state, actions) => {
            state.login.isFetching = false;
            state.login.error = true;
            state.mgs = actions.payload?.message;
        },
        logOutStart: (state) => {
            state.login.isFetching = true;
        },
        logOutSuccess: (state) => {
            state.login.isFetching = false;
            state.login.currentUser = null;
            state.login.error = false;
        },
        logOutFailure: (state, actions) => {
            state.login.isFetching = false;
            state.login.error = true;
            state.mgs = actions.payload?.message;
        },
        Registerstart: (state) => {
            state.register.isFetching = true;
        },
        RegisterSuccess: (state, actions) => {
            state.register.isFetching = false;
            state.register.error = false;
            state.mgs = actions.payload.message;
        },
        RegisterFailure: (state, actions) => {
            state.register.isFetching = false;
            state.register.error = true;
            state.mgs = actions.payload.message;
        },

        UpdateUserSuccess: (state, actions) => {
            state.login.currentUser = actions.payload;
        },
    },
});

export const {
    setFetchingState,
    setSuccessState,
    setFailureState,
    Registerstart,
    RegisterSuccess,
    RegisterFailure,
    logOutSuccess,
    UpdateUserSuccess,
} = authSlice.actions;
export default authSlice.reducer;
