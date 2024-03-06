import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import Axios from 'axios';
import { ApiLink } from "../../apilinks/api";

export const getProductsRepairHistory =createAsyncThunk("productsrepairhistory/getproductsrepairhistory",async()=>{
    return Axios.get(ApiLink.productsrepairhistory)
                    .then(res=> {return res.data});
                    
});

export const postProductsRepairHistory = createAsyncThunk("productsrepairhistory/postproductsrepairhistory",async(newProductData)=>{
    console.log(newProductData);
    return Axios.post(ApiLink.productsrepairhistory,newProductData)
                    .then(res => {return res.data});
});

export const putProductsRepairHistory = createAsyncThunk("productsrepairhistory/putproductsrepairhistory",async(updatedProductData)=>{
    const {id,...restData} = updatedProductData;

    try{
        const response = await Axios.put(`${ApiLink.productsrepairhistory}/${id}`,{id,...restData});
        return response.data;
    }catch(error){
        console.error('Error Updating Product:',error);
        throw error;
    }
});

export const deleteProductsRepairHistory = createAsyncThunk("productsrepairhistory/deleteproductsrepairhistory",async(id) =>{
    return Axios.delete(`${ApiLink.productsrepairhistory}/${id}`)
                       .then(()=>id);
});

const productsrepairhistorySlice = createSlice({
    name:"productsrepairhistory",
    initialState: {
        productsrepairhistory:[],       
        loading:false,
      
    },
    // reducers:{},
    extraReducers:(builder)=>{
        builder
        //Get Method
        .addCase(getProductsRepairHistory.pending,(state)=>{
            state.loading = true;
            // console.log('getProducts is pending');
        })
        .addCase(getProductsRepairHistory.fulfilled,(state,action)=>{
            state.loading = false;
            state.productsrepairhistory = action.payload;
            // console.log('getProducts fulfilled. Updated products:', state.productsDetail);
        })
        .addCase(getProductsRepairHistory.rejected,(state,action)=>{
            state.loading = false;
            //state.error = action.error.message || 'An error occured';
            //console.log('Error Fetching Data:',action.error);
        })
        //Post Method
        .addCase(postProductsRepairHistory.pending, (state) => {
            state.loading = true;
        })
        .addCase(postProductsRepairHistory.fulfilled, (state, action) => {
            state.loading = false;
            state.productsrepairhistory = [...state.productsrepairhistory, action.payload]
        })
        .addCase(postProductsRepairHistory.rejected, (state) => {
            state.loading = false;
        })
         // Put method
         .addCase(putProductsRepairHistory.pending, (state) => {
            state.loading = true;
        })
        .addCase(putProductsRepairHistory.fulfilled, (state, action) => {
            state.loading = false;
            state.productsrepairhistory = state.productsrepairhistory.map((item) => item.id === action.payload.id ? action.payload : item);
            console.log(state.productsrepairhistory);
        })
        .addCase(putProductsRepairHistory.rejected, (state) => {
            state.loading = false;
        })
        // Delete method
      .addCase(deleteProductsRepairHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProductsRepairHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.productsrepairhistory = state.productsrepairhistory.filter(item => item.id !== action.payload);
      })
      .addCase(deleteProductsRepairHistory.rejected, (state) => {
        state.loading = false;
      });
      
    }, 
});

export default productsrepairhistorySlice.reducer;