import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axiosInstance from "../../Service/config";


export const deleteTransaction = createAsyncThunk('transaction/delete-transaction', async (transactionId) =>{
    try{
        return await axiosInstance.post(`transaction/delete-transaction/${transactionId}`)
    }catch (error) {
        return error;
    }
});
export const infoTransaction = createAsyncThunk('transaction/info-transaction', async (id) =>{
    try{
        return await axiosInstance.get(`transaction/info-transaction/${id}`)
    }catch (error) {
        return error;
    }
})
const initialState ={
    loading: false,
    error: '',
    infoTransaction: { code: 0, data: {} },
    transactionDelete: { code: 0, data: {}}
}
const transactionSlice = createSlice({
    name: 'transaction',
    initialState: initialState,
    reducers: {},
    extraReducers:{
        [`${infoTransaction.pending}`] :(state) =>{
            state.loading= true;
        },
        [`${infoTransaction.rejected}`]: (state, action) =>{
            state.loading = false;
            state.error = action.error;
        },
        [`${infoTransaction.fulfilled}`]: (state, action) =>{
            state.loading = false;
            state.infoTransaction = action.payload.data;
        },
        [`${deleteTransaction.pending}`] :(state) =>{
            state.loading = true;
        },
        [`${deleteTransaction.rejected}`] : (state, action)=>{
            state.loading = false;
            state.error = action.error;
        },
        [`${deleteTransaction.fulfilled}`]: (state, action) => {
            state.loading = false;
            state.transactionDelete = action.payload;
        },
    },
});
export const { reducer: transactionReducer } = transactionSlice;
export default transactionReducer;

