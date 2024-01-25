import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import  Axios  from 'axios';
import {ApiLink} from '../../apilinks/api'


export const getEmployees = createAsyncThunk('gets/getemployee', async()=>{
    return Axios.get(ApiLink.employedetails).then(res => {return res.data});
});

export const postEmployees = createAsyncThunk('post/postemployee', async(data)=>{
    return Axios.post(ApiLink.employedetails,data).then(res => {return res.data});
});

export const putEmployees = createAsyncThunk('put/putemployee',async(data)=>{
    const {id,...restdata} = data;
    return Axios.put(`${ApiLink.employedetails}/${id}`,{id,...restdata}).then(res => {return res.data});
});

export const deleteEmployee = createAsyncThunk('delete/deleteEmployee',async(id)=>{
    return Axios.delete(`${ApiLink.employedetails}/${id}`).then(()=> id);
});

const employeeSlice = createSlice({
    name: "employee",
    initialState:{
        employee: [],
        loading:false
    },
    extraReducers:(builder)=>{
        builder
        .addCase(getEmployees.pending,(state,action)=>{
            state.loading = true;
        })
        .addCase(getEmployees.fulfilled,(state,action)=>{
            state.loading = false;
            state.employee= action.payload; 
        })
        .addCase(getEmployees.rejected,(state,action)=>{
            state.loading = false;
        })
        //Post Method
        .addCase(postEmployees.pending, (state) => {
            state.loading = true;
        })
        .addCase(postEmployees.fulfilled, (state, action) => {
            state.loading = false;
            state.employee = [...state.employee, action.payload]
        })
        .addCase(postEmployees.rejected, (state) => {
            state.loading = false;
        })
         // Put method
         .addCase(putEmployees.pending, (state) => {
            state.loading = true;
        })
        .addCase(putEmployees.fulfilled, (state, action) => {
            state.loading = false;
            state.employee = state.employee.map((item) => item.id === action.payload.id ? action.payload : item);
            console.log(state.employee);
        })
        .addCase(putEmployees.rejected, (state) => {
            state.loading = false;
        })
        // Delete method
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employee = state.employee.filter(item => item.id !== action.payload);
      })
      .addCase(deleteEmployee.rejected, (state) => {
        state.loading = false;
      });
    }
});

export default employeeSlice.reducer;