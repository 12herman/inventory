import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import Axios from 'axios';
import {ApiLink} from '../../apilinks/api'

const apiName = "leaderemployee";
const apilink = ApiLink.leaderemployee;


//Get 
export const getleaderemployee = createAsyncThunk(`${apiName}/get${apiName}`, async()=>{
    return Axios.get(apilink)
                .then(res => {return res.data});
});

//Post
export const postleaderemployee = createAsyncThunk(`${apiName}/post${apiName}`,async(data)=>{
    return Axios.post(apilink,data)
                .then(res => {return res.data});
});

//Put
export const putleaderemployee = createAsyncThunk(`${apiName}/put${apiName}`,async(putdata)=>{
    const {id, ...restData} = putdata;
    return  Axios.put (`${apilink}/${id}`,{id,...restData})
                 .then(res => res.data);
});

//Delete
export const deletedleaderemployee = createAsyncThunk(`${apiName}/delete${apiName}`,async(id)=>{
    return Axios.delete(`${apilink}/${id}`)
                .then(()=>id);
});



const leaderemployeeSlice = createSlice({
    name:apiName,
    initialState:{
        leaderemployee:[],
        leaderemployeeloading:false
    },
    extraReducers: (builder) => {
        builder
        //Get
        .addCase(getleaderemployee.pending,(state)=>{
            state.leaderemployeeloading = true;
        })
        .addCase(getleaderemployee.fulfilled,(state,action)=>{
            state.leaderemployeeloading = false;
            state.leaderemployee = action.payload;
        })
        .addCase(getleaderemployee.rejected,(state)=>{
            state.leaderemployeeloading = false;
        })
        //Post
        .addCase(postleaderemployee.pending, (state) => {
            state.leaderemployeeloading = true;
        })
        .addCase(postleaderemployee.fulfilled, (state, action) => {
            state.leaderemployeeloading = false;
            state.leaderemployee = [...state.leaderemployee, action.payload]
        })
        .addCase(postleaderemployee.rejected, (state) => {
            state.leaderemployeeloading = false;
        })
        // Put 
        .addCase(putleaderemployee.pending, (state) => {
            state.leaderemployeeloading = true;
        })
        .addCase(putleaderemployee.fulfilled, (state, action) => {
            state.leaderemployeeloading = false;
            state.leaderemployee = state.leaderemployee.map((item) => item.id === action.payload.id ? action.payload : item);
        })
        .addCase(putleaderemployee.rejected, (state) => {
            state.leaderemployeeloading = false;
        })
         // Delete 
      .addCase(deletedleaderemployee.pending, (state) => {
        state.leaderemployeeloading = true;
      })
      .addCase(deletedleaderemployee.fulfilled, (state, action) => {
        state.leaderemployeeloading = false;
        state.leaderemployee = state.leaderemployee.filter(item => item.id !== action.payload);
      })
      .addCase(deletedleaderemployee.rejected, (state) => {
        state.leaderemployeeloading = false;
      });
    }
});

export default leaderemployeeSlice.reducer;