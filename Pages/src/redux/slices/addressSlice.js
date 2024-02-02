import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import Axios from "axios";
import {ApiLink} from '../../apilinks/api';

const apiName = 'address';
const apilink = ApiLink.address;

//Get
export const getAddress = createAsyncThunk(`${apiName}/get${apiName}`,async ()=> {
    return Axios.get(apilink)
           .then(res => {return res.data});
});

//Post
export const postAddress = createAsyncThunk(`${apiName}/post${apiName}`,async (data)=>{
    return Axios.post(apilink,data).then(res => {return res.data});
});

//Put
export const putAddress = createAsyncThunk(`${apiName}/put${apiName}`,async (data)=>{
    const {id,...restData} = data;
    return Axios.put(`${apilink}/${id}`,{id,...restData}).then(res=> res.data);
});

//Delete
export const deleteAddress = createAsyncThunk(`${apiName}/delete${apiName}`, async(id)=>{
    return Axios.delete(`${apilink}/${id}`).then(()=> id);
});

const addressSlice = createSlice({
    name:apiName,
    initialState:{
        address:[],
        addressloading:false
    },
    extraReducers: (builder)=>{
        builder
        //Get
        .addCase(getAddress.pending,(state)=>{
            state.addressloading = true;
        })
        .addCase(getAddress.fulfilled,(state,action)=>{
            state.addressloading = false;
            state.address = action.payload;
        })
        .addCase(getAddress.rejected,(state)=>{
            state.addressloading = false
        })
        //Post
        .addCase(postAddress.pending,(state)=>{
            state.addressloading = true;
        })
        .addCase(postAddress.fulfilled,(state,action)=>{
            state.addressloading = false;
            state.address= [...state.address,action.payload];
        })
        .addCase(postAddress.rejected,(state)=>{
            state.addressloading = false;
        })
        //Put
        .addCase(putAddress.pending,(state)=>{
            state.addressloading = true;
        })
        .addCase(putAddress.fulfilled,(state,action)=>{
            state.addressloading = false;
            state.address = state.address.map((data)=> data.id === action.payload.id ? action.payload : data);
        })
        .addCase(putAddress.rejected,(state)=>{
            state.addressloading = false;
        })
        //Delete
        .addCase(deleteAddress.pending,(state)=>{
            state.addressloading = true;
        })
        .addCase(deleteAddress.fulfilled,(state,action)=>{
            state.addressloading = false;
            state.address = state.address.filter(data => data.id !== action.payload.id)
        })
        .addCase(deleteAddress.rejected,(state)=>{
            state.addressloading = false;
        })
    }
});

export default addressSlice.reducer;