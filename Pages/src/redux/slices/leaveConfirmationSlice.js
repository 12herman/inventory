import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import Axios from 'axios';
import {ApiLink} from '../../apilinks/api'

const apiName = "leaveconfirmation";
const apilink = ApiLink.leaveconfirmationemail;


//Post
export const Postleaveconfirmation = createAsyncThunk(`${apiName}/post${apiName}`,async(data)=>{
    console.log(data);
    return Axios.post(apilink,data)
                .then(res => {return res.data});
});

const leaveconfirmationSlice = createSlice({
    name:apiName,
    initialState:{
        leaveconfirmation:[],
        leaveconfirmationloading:false,
    },
    extraReducers: (builder) => {
        builder
        //Post
        .addCase(Postleaveconfirmation.pending, (state) => {
            state.leaveconfirmationloading = true;
        })
        .addCase(Postleaveconfirmation.fulfilled, (state, action) => {
            state.leaveconfirmationloading = false;
            state.leaveconfirmation = [...state.leaveconfirmation, action.payload]
        })
        .addCase(Postleaveconfirmation.rejected, (state) => {
            state.leaveconfirmationloading = false;
        })
        
     
    }
});

export default leaveconfirmationSlice.reducer;