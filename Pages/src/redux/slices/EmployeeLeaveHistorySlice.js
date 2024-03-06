import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import Axios from 'axios';
import {ApiLink} from '../../apilinks/api'

const apiName = "employeeleavehistory";
const apilink = ApiLink.employeeleavehistory;

//Get 
export const Getemployeeleavehistory = createAsyncThunk(`${apiName}/get${apiName}`, async()=>{
    return Axios.get(apilink)
                .then(res => {return res.data});
});

//Post
export const Postemployeeleavehistory = createAsyncThunk(`${apiName}/post${apiName}`,async(data)=>{
    return Axios.post(apilink,data)
                .then(res => {return res.data});
});

//Put
export const Putemployeeleavehistory = createAsyncThunk(`${apiName}/put${apiName}`,async(putdata)=>{
    const {id, ...restData} = putdata;
    return  Axios.put (`${apilink}/${id}`,{id,...restData})
                 .then(res => res.data);
});

//Delete
export const Deletedemployeeleavehistory = createAsyncThunk(`${apiName}/delete${apiName}`,async(id)=>{
    return Axios.delete(`${apilink}/${id}`)
                .then(()=>id);
});




const employeeleavehistorySlice = createSlice({
    name:apiName,
    initialState:{
        employeeleavehistory:[],
        employeeleavehistoryloading:false,
    },
    extraReducers: (builder) => {
        builder
        //Get
        .addCase(Getemployeeleavehistory.pending,(state)=>{
            state.employeeleavehistoryloading = true;
        })
        .addCase(Getemployeeleavehistory.fulfilled,(state,action)=>{
            state.employeeleavehistoryloading = false;
            state.employeeleavehistory = action.payload;
        })
        .addCase(Getemployeeleavehistory.rejected,(state)=>{
            state.employeeleavehistoryloading = false;
        })
        //Post
        .addCase(Postemployeeleavehistory.pending, (state) => {
            state.employeeleavehistoryloading = true;
        })
        .addCase(Postemployeeleavehistory.fulfilled, (state, action) => {
            state.employeeleavehistoryloading = false;
            state.employeeleavehistory = [...state.employeeleavehistory, action.payload]
        })
        .addCase(Postemployeeleavehistory.rejected, (state) => {
            state.employeeleavehistoryloading = false;
        })
        // Put 
        .addCase(Putemployeeleavehistory.pending, (state) => {
            state.employeeleavehistoryloading = true;
        })
        .addCase(Putemployeeleavehistory.fulfilled, (state, action) => {
            state.employeeleavehistoryloading = false;
            state.employeeleavehistory = state.employeeleavehistory.map((item) => item.id === action.payload.id ? action.payload : item);
        })
        .addCase(Putemployeeleavehistory.rejected, (state) => {
            state.employeeleavehistoryloading = false;
        })
         // Delete 
      .addCase(Deletedemployeeleavehistory.pending, (state) => {
        state.employeeleavehistoryloading = true;
      })
      .addCase(Deletedemployeeleavehistory.fulfilled, (state, action) => {
        state.employeeleavehistoryloading = false;
        state.employeeleavehistory = state.employeeleavehistory.filter(item => item.id !== action.payload);
      })
      .addCase(Deletedemployeeleavehistory.rejected, (state) => {
        state.employeeleavehistoryloading = false;
      })
     
    }
});

export default employeeleavehistorySlice.reducer;