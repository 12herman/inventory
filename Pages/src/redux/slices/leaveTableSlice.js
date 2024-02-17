import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import Axios from 'axios';
import {ApiLink} from '../../apilinks/api'

const apiName = "leavetable";
const apilink = ApiLink.leavetable;

//Get 
export const Getleavetable = createAsyncThunk(`${apiName}/get${apiName}`, async()=>{
    return Axios.get(apilink)
                .then(res => {return res.data});
});

//Post
export const Postleavetable = createAsyncThunk(`${apiName}/post${apiName}`,async(data)=>{
    return Axios.post(apilink,data)
                .then(res => {return res.data});
});

//Put
export const Putleavetable = createAsyncThunk(`${apiName}/put${apiName}`,async(putdata)=>{
    const {id, ...restData} = putdata;
    return  Axios.put (`${apilink}/${id}`,{id,...restData})
                 .then(res => res.data);
});

//Delete
export const Deletedleavetable = createAsyncThunk(`${apiName}/delete${apiName}`,async(id)=>{
    return Axios.delete(`${apilink}/${id}`)
                .then(()=>id);
});




const LeaveTableSlice = createSlice({
    name:apiName,
    initialState:{
        leavetable:[],
        leavetableloading:false,
    },
    extraReducers: (builder) => {
        builder
        //Get
        .addCase(Getleavetable.pending,(state)=>{
            state.leavetableloading = true;
        })
        .addCase(Getleavetable.fulfilled,(state,action)=>{
            state.leavetableloading = false;
            state.leavetable = action.payload;
        })
        .addCase(Getleavetable.rejected,(state)=>{
            state.leavetableloading = false;
        })
        //Post
        .addCase(Postleavetable.pending, (state) => {
            state.leavetableloading = true;
        })
        .addCase(Postleavetable.fulfilled, (state, action) => {
            state.leavetableloading = false;
            state.leavetable = [...state.leavetable, action.payload]
        })
        .addCase(Postleavetable.rejected, (state) => {
            state.leavetableloading = false;
        })
        // Put 
        .addCase(Putleavetable.pending, (state) => {
            state.leavetableloading = true;
        })
        .addCase(Putleavetable.fulfilled, (state, action) => {
            state.leavetableloading = false;
            state.leavetable = state.leavetable.map((item) => item.id === action.payload.id ? action.payload : item);
        })
        .addCase(Putleavetable.rejected, (state) => {
            state.leavetableloading = false;
        })
         // Delete 
      .addCase(Deletedleavetable.pending, (state) => {
        state.leavetableloading = true;
      })
      .addCase(Deletedleavetable.fulfilled, (state, action) => {
        state.leavetableloading = false;
        state.leavetable = state.leavetable.filter(item => item.id !== action.payload);
      })
      .addCase(Deletedleavetable.rejected, (state) => {
        state.leavetableloading = false;
      })
     
    }
});

export default LeaveTableSlice.reducer;