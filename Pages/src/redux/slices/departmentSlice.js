import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import Axios from 'axios';
import {ApiLink} from '../../apilinks/api';

const apiName = 'department';
const apilink = ApiLink.department;

//Get
export const getDepartment = createAsyncThunk(`${apiName}/get${apiName}`,async()=>{
    return Axios.get(apilink)
                .then(res => {return res.data});
});

//Post
export const postDepartment = createAsyncThunk(`${apiName}/post${apiName}`,async(data)=>{
        return Axios.post(apilink,data)
                    .then(res => {return res.data});
});

//Put
export const putDepartment = createAsyncThunk(`${apiName}/put${apiName}`,async(data)=>{
    const {id,...restData} = data;
    console.log({id,...restData});
    return Axios.put(`${apilink}/${id}`,{id,...restData})
                .then(res=>res.data);
});

//Delete
export const deleteDepartment = createAsyncThunk(`${apiName}/delete${apiName}`,async(id)=>{
    return Axios.delete(`${apilink}/${id}`)
                .then(()=>id);
});


const departmentSlice = createSlice({
    name:apiName,
    initialState:{
        department:[],
        departmentloading:false
    },
    extraReducers: (builder)=>{
        builder
        //Get
        .addCase(getDepartment.pending,(state)=>{
            state.departmentloading = true;
        })
        .addCase(getDepartment.fulfilled,(state,action)=>{
            state.departmentloading = false;
            state.department = action.payload;
        })
        .addCase(getDepartment.rejected,(state)=>{
            state.departmentloading = false
        })
        //Post
        .addCase(postDepartment.pending,(state)=>{
            state.departmentloading = true;
        })
        .addCase(postDepartment.fulfilled,(state,action)=>{
            state.departmentloading = false;
            state.department= [...state.department,action.payload];
        })
        .addCase(postDepartment.rejected,(state)=>{
            state.departmentloading = false;
        })
        //Put
        .addCase(putDepartment.pending,(state)=>{
            state.departmentloading = true;
        })
        .addCase(putDepartment.fulfilled,(state,action)=>{
            state.departmentloading = false;
            state.department = state.department.map((data)=> data.id === action.payload.id ? action.payload : data);
        })
        .addCase(putDepartment.rejected,(state)=>{
            state.departmentloading = false;
        })
        //Delete
        .addCase(deleteDepartment.pending,(state)=>{
            state.departmentloading = true;
        })
        .addCase(deleteDepartment.fulfilled,(state,action)=>{
            state.departmentloading = false;
            state.department = state.department.filter(data => data.id !== action.payload.id)
        })
        .addCase(deleteDepartment.rejected,(state)=>{
            state.departmentloading = false;
        })
    }
});

export default departmentSlice.reducer;