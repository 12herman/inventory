import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import Axios from 'axios';
import {ApiLink} from '../../apilinks/api';

const apiName = 'roledetail';
const apilink = ApiLink.roledetail;

//Get
export const getRoleDetail = createAsyncThunk(`${apiName}/get${apiName}`,async()=>{
    return Axios.get(apilink)
                .then(res => {return res.data});
});

//Post
export const postRoleDetail = createAsyncThunk(`${apiName}/post${apiName}`,async(data)=>{
        return Axios.post(apilink,data)
                    .then(res => {return res.data});
});

//Put
export const putRoleDetail = createAsyncThunk(`${apiName}/put${apiName}`,async(data)=>{
    const {id,...restData} = data;
    console.log({id,...restData});
    return Axios.put(`${apilink}/${id}`,{id,...restData})
                .then(res=>res.data);
});

//Delete
export const deleteRoleDetail = createAsyncThunk(`${apiName}/delete${apiName}`,async(id)=>{
    return Axios.delete(`${apilink}/${id}`)
                .then(()=>id);
});


const roledetailSlice = createSlice({
    name:apiName,
    initialState:{
        roledetail:[],
        roledetailloading:false
    },
    extraReducers: (builder)=>{
        builder
        //Get
        .addCase(getRoleDetail.pending,(state)=>{
            state.roledetailloading = true;
        })
        .addCase(getRoleDetail.fulfilled,(state,action)=>{
            state.roledetailloading = false;
            state.roledetail = action.payload;
        })
        .addCase(getRoleDetail.rejected,(state)=>{
            state.roledetailloading = false
        })
        //Post
        .addCase(postRoleDetail.pending,(state)=>{
            state.roledetailloading = true;
        })
        .addCase(postRoleDetail.fulfilled,(state,action)=>{
            state.roledetailloading = false;
            state.roledetail= [...state.roledetail,action.payload];
        })
        .addCase(postRoleDetail.rejected,(state)=>{
            state.roledetailloading = false;
        })
        //Put
        .addCase(putRoleDetail.pending,(state)=>{
            state.roledetailloading = true;
        })
        .addCase(putRoleDetail.fulfilled,(state,action)=>{
            state.roledetailloading = false;
            state.roledetail = state.roledetail.map((data)=> data.id === action.payload.id ? action.payload : data);
        })
        .addCase(putRoleDetail.rejected,(state)=>{
            state.roledetailloading = false;
        })
        //Delete
        .addCase(deleteRoleDetail.pending,(state)=>{
            state.roledetailloading = true;
        })
        .addCase(deleteRoleDetail.fulfilled,(state,action)=>{
            state.roledetailloading = false;
            state.roledetail = state.roledetail.filter(data => data.id !== action.payload.id)
        })
        .addCase(deleteRoleDetail.rejected,(state)=>{
            state.roledetailloading = false;
        })
    }
});

export default roledetailSlice.reducer;