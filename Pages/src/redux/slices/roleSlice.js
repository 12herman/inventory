import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import Axios from 'axios';
import {ApiLink} from '../../apilinks/api'

//Get
export const getrole = createAsyncThunk('role/getroledetails',async()=>{
    return Axios.get(ApiLink.role)
                .then(res => {return res.data});
});
//Post
export const postrole = createAsyncThunk('role/postrole',async(newrole)=>{
    return Axios.post(ApiLink.role,newrole)
          .then(res => {return res.data});
});
//Put
export const putrole = createAsyncThunk('role/putrole',async(putdata)=>{
    const {id, ...restData} = putdata;
    return await Axios.put(`${ApiLink.role}/${id}`,{id,...restData}).then(res => res.data);
});
//Delete
export const deleterole = createAsyncThunk('role/deleterole',async(id)=>{
    console.log(id);
    return Axios.delete(`${ApiLink.role}?id=${id}`)
                .then(()=> id);
});


const roleSlice = createSlice({
    name:"role",
    initialState:{
        role:[],
        roleloading:false
    },
    extraReducers: (builder) =>{
        builder
        //Get
        .addCase(getrole.pending,(state)=>{
            state.roleloading = true;
        })
        .addCase(getrole.fulfilled,(state,action)=>{
            state.roleloading = false;
            state.role = action.payload;
        })
        .addCase(getrole.rejected,(state)=>{
            state.roleloading = false;
        })
        //Post
        .addCase(postrole.pending, (state) => {
            state.roleloading = true;
        })
        .addCase(postrole.fulfilled, (state, action) => {
            state.roleloading = false;
            state.role = [...state.role, action.payload]
        })
        .addCase(postrole.rejected, (state) => {
            state.roleloading = false;
        })
         // Put 
         .addCase(putrole.pending, (state) => {
            state.roleloading = true;
        })
        .addCase(putrole.fulfilled, (state, action) => {
            state.roleloading = false;
            state.role = state.role.map((item) => item.id === action.payload.id ? action.payload : item);
        })
        .addCase(putrole.rejected, (state) => {
            state.roleloading = false;
        })
         // Delete 
      .addCase(deleterole.pending, (state) => {
        state.roleloading = true;
      })
      .addCase(deleterole.fulfilled, (state, action) => {
        state.roleloading = false;
        state.role = state.role.filter(item => item.id !== action.payload);
      })
      .addCase(deleterole.rejected, (state) => {
        state.roleloading = false;
      });
        
    }
});
export default roleSlice.reducer;