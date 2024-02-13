import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import Axios from 'axios';
import {ApiLink} from '../../apilinks/api'

export const getProductStorageLocation = createAsyncThunk('get/getproductstoragelocation',async()=>{
    return Axios.get(ApiLink.productstoragelocation)
                .then(res => {return res.data}); 
});

export const postProductStorageLocation = createAsyncThunk('productstoragelocation/postproductstoragelocation', async (newProductData) => {
    console.log(newProductData);
    return Axios.post(ApiLink.productstoragelocation, newProductData)
        .then(res => { return res.data });
        
});


export const putProductStorageLocation = createAsyncThunk('productstoragelocation/putproductstoragelocation', async (updatedProductData) => {
    const { id, ...restData } = updatedProductData;
    return await Axios.put(`${ApiLink.productstoragelocation}/${id}`,{id,...restData}).then(res => res.data);
});

export const deleteProductStorageLocation = createAsyncThunk('productstoragelocation/deleteproductstoragelocation', async (id) => {
    return Axios.delete(`${ApiLink.productstoragelocation}/${id}`)
                .then(() => id);
  });

const productStorageLocationSlice = createSlice({
    name:"productstoragelocation",
    initialState: {
        productstoragelocation:[],       
        loading:false,
    },
    // reducers:{},
    extraReducers:(builder)=>{
        
        builder
        //Get Method
        .addCase(getProductStorageLocation.pending,(state)=>{
            state.loading = true;
            console.log('getProducts is pending');
        })
        .addCase(getProductStorageLocation.fulfilled,(state,action)=>{
            state.loading = false;
            state.productstoragelocation = action.payload;
            console.log('getProducts fulfilled. Updated products:', state.productstoragelocation);
        })
        .addCase(getProductStorageLocation.rejected,(state,action)=>{
            state.loading = false;
            //state.error = action.error.message || 'An error occured';
            //console.log('Error Fetching Data:',action.error);
        })
        //Post Method
        .addCase(postProductStorageLocation.pending, (state) => {
            state.loading = true;
        })
        .addCase(postProductStorageLocation.fulfilled, (state, action) => {
            state.loading = false;
            state.productstoragelocation = [...state.productstoragelocation, action.payload]
        })
        .addCase(postProductStorageLocation.rejected, (state) => {
            state.loading = false;
        })
         // Put method
         .addCase(putProductStorageLocation.pending, (state) => {
            state.loading = true;
        })
        .addCase(putProductStorageLocation.fulfilled, (state, action) => {
            state.loading = false;
            state.productstoragelocation = state.productstoragelocation.map((item) => item.id === action.payload.id ? action.payload : item);
            console.log(state.productstoragelocation);
        })
        .addCase(putProductStorageLocation.rejected, (state) => {
            state.loading = false;
        })
        // Delete method
      .addCase(deleteProductStorageLocation.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProductStorageLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.productstoragelocation = state.productstoragelocation.filter(item => item.id !== action.payload);
      })
      .addCase(deleteProductStorageLocation.rejected, (state) => {
        state.loading = false;
      });
    },
});
export default productStorageLocationSlice.reducer;

