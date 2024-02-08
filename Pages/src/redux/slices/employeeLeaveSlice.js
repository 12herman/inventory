import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import Axios from 'axios';
import {ApiLink} from '../../apilinks/api';
import { faL } from '@fortawesome/free-solid-svg-icons';


const ApiName = 'employeeleave';
const Links= ApiLink.employeeleave;

//get
export const Getemployeeleave= createAsyncThunk(`${ApiName}/get${ApiName}`,async ()=>{
    return Axios.get(Links).then(res=> {return res.data});
});
//post
export const Postemployeeleave = createAsyncThunk(`${ApiName}/post${ApiName}`,async (data)=>{
    return Axios.post(Links,data).then(res=> {return res.data});
});
//put 
export const Putemployeeleave = createAsyncThunk(`${ApiName}/put${ApiName}`,async(data)=>{
    const {id,...restData} = data;   
    return Axios.put(`${Links}/${id}`,{id,...restData}).then(res=> res.data);
});
//delete
export const Deleteemployeeleave = createAsyncThunk(`${ApiName}/delete${ApiName}`,async(id)=>{
    return Axios.delete(`${Links}/${id}`).then(()=> id);
});

const employeeleaveSlice = createSlice({
    name:ApiName,
    initialState:{
        employeeleave:[],
        employeeleaveloading:false
    },
    extraReducers:(builder)=>{
        builder
        //get
        .addCase(Getemployeeleave.pending,(state)=>{
            state.employeeleaveloading = true;
        })
        .addCase(Getemployeeleave.fulfilled,(state,action)=>{
            state.employeeleaveloading= false;
            state.employeeleave = action.payload;
        })
        .addCase(Getemployeeleave.rejected,(state)=>{
            state.employeeleaveloading = false;
        })
        //Put
        .addCase(Putemployeeleave.pending,(state)=>{
            state.employeeleaveloading = true;
        })
        .addCase(Putemployeeleave.fulfilled,(state,action)=>{
            state.employeeleaveloading = false;
            state.employeeleave = state.employeeleave.map((data)=> data.id === action.payload.id ? action.payload : data);
        })
        .addCase(Putemployeeleave.rejected,(state)=>{
            state.employeeleaveloading = false;
        })
        //Post
        .addCase(Postemployeeleave.pending,(state)=>{
            state.employeeleaveloading = true;
        })
        .addCase(Postemployeeleave.fulfilled,(state,action)=>{
            state.employeeleaveloading = false;
            state.employeeleave= [...state.employeeleave,action.payload];
        })
        .addCase(Postemployeeleave.rejected,(state)=>{
            state.employeeleaveloading = false;
        })
         //Delete
         .addCase(Deleteemployeeleave.pending,(state)=>{
            state.employeeleaveloading = true;
        })
        .addCase(Deleteemployeeleave.fulfilled,(state,action)=>{
            state.employeeleaveloading = false;
            state.employeeleave = state.employeeleave.filter(data => data.id !== action.payload.id)
        })
        .addCase(Deleteemployeeleave.rejected,(state)=>{
            state.employeeleaveloading = false;
        })
    }
});

export default employeeleaveSlice.reducer;