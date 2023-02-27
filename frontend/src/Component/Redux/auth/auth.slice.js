import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from "../../Service/config";

export const signIn = createAsyncThunk('auth/sign-in', async (body) => {
    try {
        return await axiosInstance.post(`auth/sign-in`, body);
    } catch (error) {
        console.log(error);
        return error;
    }
});
export const getMe = createAsyncThunk('user/get-me', async () => {
    try {
        return await axiosInstance.get(`user/get-me`);
    } catch (error) {
        console.log(error)
        return error;
    }
})
const initialState = {
    loading: false,
    error: '',
    auth: {code: 0, data: {}},
};

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        // đang load
        [`${signIn.pending}`]: (state) => {
            state.loading = true;
        },
        //huy
        [`${signIn.rejected}`]: (state, action) => {
            state.loading = false;
            state.error = action.error;
        },
        //hoàn thành
        [`${signIn.fulfilled}`]: (state, action) => {
            state.loading = false;
            state.user = action.payload;
        },

        //get-me
        [`${getMe.pending}`]: (state) => {
            state.loading = true;
        },
        [`${getMe.rejected}`]: (state, action) => {
            state.loading = false;
            state.error = action.error;
        },
        [`${getMe.fulfilled}`]: (state, action) => {
            state.loading = false;
            state.user = action.payload
        }
        ,
    },
});
export const {reducer: authReducer} = authSlice;
export default authReducer;
