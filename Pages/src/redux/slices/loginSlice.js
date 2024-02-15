import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import Axios from 'axios';
import {ApiLink} from '../../apilinks/api'

const apiName = "login";
const apilink = ApiLink.login;
const apiAuth = ApiLink.loginauth

//Get 
export const GetLogin = createAsyncThunk(`${apiName}/get${apiName}`, async()=>{
    return Axios.get(apilink)
                .then(res => {return res.data});
});

//Post
export const PostLogin = createAsyncThunk(`${apiName}/post${apiName}`,async(data)=>{
    return Axios.post(apilink,data)
                .then(res => {return res.data});
});

//Put
export const PutLogin = createAsyncThunk(`${apiName}/put${apiName}`,async(putdata)=>{
    const {id, ...restData} = putdata;
    return  Axios.put (`${apilink}/${id}`,{id,...restData})
                 .then(res => res.data);
});

//Delete
export const DeletedLogin = createAsyncThunk(`${apiName}/delete${apiName}`,async(id)=>{
    return Axios.delete(`${apilink}/${id}`)
                .then(()=>id);
});

//Authondication
export const CheckAuthentication = createAsyncThunk(`${apiName}`, async () => {
    return Axios.post(`${apiAuth}`).then((res) => res.data);
  });


const loginSlice = createSlice({
    name:apiName,
    initialState:{
        login:[],
        loginloading:false,
        isAuthenticated: false,
    },
    extraReducers: (builder) => {
        builder
        //Get
        .addCase(GetLogin.pending,(state)=>{
            state.loginloading = true;
        })
        .addCase(GetLogin.fulfilled,(state,action)=>{
            state.loginloading = false;
            state.login = action.payload;
        })
        .addCase(GetLogin.rejected,(state)=>{
            state.loginloading = false;
        })
        //Post
        .addCase(PostLogin.pending, (state) => {
            state.loginloading = true;
        })
        .addCase(PostLogin.fulfilled, (state, action) => {
            state.loginloading = false;
            state.login = [...state.login, action.payload]
        })
        .addCase(PostLogin.rejected, (state) => {
            state.loginloading = false;
        })
        // Put 
        .addCase(PutLogin.pending, (state) => {
            state.loginloading = true;
        })
        .addCase(PutLogin.fulfilled, (state, action) => {
            state.loginloading = false;
            state.login = state.login.map((item) => item.id === action.payload.id ? action.payload : item);
        })
        .addCase(PutLogin.rejected, (state) => {
            state.loginloading = false;
        })
         // Delete 
      .addCase(DeletedLogin.pending, (state) => {
        state.loginloading = true;
      })
      .addCase(DeletedLogin.fulfilled, (state, action) => {
        state.loginloading = false;
        state.login = state.login.filter(item => item.id !== action.payload);
      })
      .addCase(DeletedLogin.rejected, (state) => {
        state.loginloading = false;
      })
      // Authendication
      .addCase(CheckAuthentication.pending, (state) => {
        state.loginloading = true;
      })
      .addCase(CheckAuthentication.fulfilled, (state, action) => {
        state.loginloading = false;
        state.isAuthenticated = action.payload;
      })
      .addCase(CheckAuthentication.rejected, (state) => {
        state.loginloading = false;
      });
    }
});

export default loginSlice.reducer;