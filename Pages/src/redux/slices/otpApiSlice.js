import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import Axios from 'axios';
import {ApiLink} from '../../apilinks/api';

const apiName = 'otpapi';
const apilink = ApiLink.otpapi;


//Post
export const PostOtp = createAsyncThunk(`${apiName}/post${apiName}`,async(data)=>{
    console.log(data);   
    return Axios.post(apilink,data)
                    .then(res => {return res.data});
});


const otpapiSlice = createSlice({
    name:apiName,
    initialState:{
        otpapi:[],
        otpapiloading:false
    },
    extraReducers: (builder)=>{
        builder
        //Post
        .addCase(PostOtp.pending,(state)=>{
            state.otpapiloading = true;
        })
        .addCase(PostOtp.fulfilled,(state,action)=>{
            state.otpapiloading = false;
            state.otpapi= [...state.otpapi,action.payload];
        })
        .addCase(PostOtp.rejected,(state)=>{
            state.otpapiloading = false;
        })
    }
});

export default otpapiSlice.reducer;