import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import Axios from 'axios';
import {ApiLink} from '../../apilinks/api'

export const getProductsDetail = createAsyncThunk('get/getProductsDetail',async()=>{
    return Axios.get(ApiLink.productsDetail)
                .then(res => {return res.data}); 
});

export const postProductsDetail = createAsyncThunk('productsDetail/postProductsDetail', async (newProductData) => {
    console.log(newProductData);
    return Axios.post(ApiLink.productsDetail, newProductData)
        .then(res => { 
            // console.log(res.data);
            return res.data 
        });        
});


// export const putProductsDetail = createAsyncThunk('productsDetail/putProductsDetail', async (updatedProductData) => {
//     const { id, ...restData } = updatedProductData;
//     console.log({ id, ...restData });
//     return  Axios.put(`${ApiLink.productsDetail}/${id}`,{id,...restData}).then(res => console.log(res.data)
//     // {return res.data});
//     );
// });

export const putProductsDetail = createAsyncThunk('productsDetail/putProductsDetail', async (updatedProductData) => {
    const { id, ...restData } = updatedProductData;

    try {
        const response = await Axios.put(`${ApiLink.productsDetail}/${id}`, { id, ...restData });
        console.log(response.data); // Log the response data
        return response.data;
    } catch (error) {
        console.error('Error updating product:', error);
        // Handle the error appropriately
        // You might want to throw an error or return a specific error structure
        throw error;
    }
});

export const deleteProductsDetail = createAsyncThunk('productsDetail/deleteProductsDetail', async (id) => {
    return Axios.delete(`${ApiLink.productsDetail}/${id}`)
                .then(() => id);
  });

const productsDetailSlice = createSlice({
    name:"productsDetail",
    initialState: {
        productsDetail:[],       
        loading:false,
    },
    // reducers:{},
    extraReducers:(builder)=>{
        builder
        //Get Method
        .addCase(getProductsDetail.pending,(state)=>{
            state.loading = true;
            // console.log('getProducts is pending');
        })
        .addCase(getProductsDetail.fulfilled,(state,action)=>{
            state.loading = false;
            state.productsDetail = action.payload;
            // console.log('getProducts fulfilled. Updated products:', state.productsDetail);
        })
        .addCase(getProductsDetail.rejected,(state,action)=>{
            state.loading = false;
            //state.error = action.error.message || 'An error occured';
            //console.log('Error Fetching Data:',action.error);
        })
        //Post Method
        .addCase(postProductsDetail.pending, (state) => {
            state.loading = true;
        })
        .addCase(postProductsDetail.fulfilled, (state, action) => {
            state.loading = false;
            state.productsDetail = [...state.productsDetail, action.payload]
        })
        .addCase(postProductsDetail.rejected, (state) => {
            state.loading = false;
        })
         // Put method
         .addCase(putProductsDetail.pending, (state) => {
            state.loading = true;
        })
        .addCase(putProductsDetail.fulfilled, (state, action) => {
            state.loading = false;
            state.productsDetail = state.productsDetail.map((item) => item.id === action.payload.id ? action.payload : item);
            console.log(state.productsDetail);
        })
        .addCase(putProductsDetail.rejected, (state) => {
            state.loading = false;
        })
        // Delete method
      .addCase(deleteProductsDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProductsDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.productsDetail = state.productsDetail.filter(item => item.id !== action.payload);
      })
      .addCase(deleteProductsDetail.rejected, (state) => {
        state.loading = false;
      });
    },
});
export default productsDetailSlice.reducer;

