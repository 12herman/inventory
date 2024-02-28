import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import Axios from 'axios';
import {ApiLink} from '../../apilinks/api'

export const getEmployeeAccessories = createAsyncThunk('get/getEmployeeAccessories',async()=>{
    return Axios.get(ApiLink.employeeaccessories)
                .then(res => {return res.data}); 
});

export const postEmployeeAccessories = createAsyncThunk('employeeAccessories/postEmployeeAccessories', async (newProductData) => {
    console.log(newProductData);
    return Axios.post(ApiLink.employeeaccessories, newProductData)
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

export const putEmployeeAccessories = createAsyncThunk('employeeAccessories/putEmployeeAccessories', async (updatedProductData) => {
    const { id, ...restData } = updatedProductData;

    try {
        const response = await Axios.put(`${ApiLink.employeeaccessories}/${id}`, { id, ...restData });
        console.log(response.data); // Log the response data
        return response.data;
    } catch (error) {
        console.error('Error updating product:', error);
        // Handle the error appropriately
        // You might want to throw an error or return a specific error structure
        throw error;
    }
});

export const deleteEmployeeAccessories = createAsyncThunk('employeeAccessories/deleteEmployeeAccessories', async (id) => {
    return Axios.delete(`${ApiLink.employeeaccessories}/${id}`)
                .then(() => id);
  });

const employeeaccessoriesSlice = createSlice({
    name:"employeeaccessories",
    initialState: {
        employeeaccessories:[],       
        loading:false,
    },
    // reducers:{},
    extraReducers:(builder)=>{
        builder
        //Get Method
        .addCase(getEmployeeAccessories.pending,(state)=>{
            state.loading = true;
            // console.log('getProducts is pending');
        })
        .addCase(getEmployeeAccessories.fulfilled,(state,action)=>{
            state.loading = false;
            state.employeeaccessories = action.payload;
            // console.log('getProducts fulfilled. Updated products:', state.productsDetail);
        })
        .addCase(getEmployeeAccessories.rejected,(state,action)=>{
            state.loading = false;
            //state.error = action.error.message || 'An error occured';
            //console.log('Error Fetching Data:',action.error);
        })
        //Post Method
        .addCase(postEmployeeAccessories.pending, (state) => {
            state.loading = true;
        })
        .addCase(postEmployeeAccessories.fulfilled, (state, action) => {
            state.loading = false;
            state.employeeaccessories = [...state.employeeaccessories, action.payload]
        })
        .addCase(postEmployeeAccessories.rejected, (state) => {
            state.loading = false;
        })
         // Put method
         .addCase(putEmployeeAccessories.pending, (state) => {
            state.loading = true;
        })
        .addCase(putEmployeeAccessories.fulfilled, (state, action) => {
            state.loading = false;
            state.employeeaccessories = state.employeeaccessories.map((item) => item.id === action.payload.id ? action.payload : item);
            console.log(state.employeeaccessories);
        })
        .addCase(putEmployeeAccessories.rejected, (state) => {
            state.loading = false;
        })
        // Delete method
      .addCase(deleteEmployeeAccessories.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteEmployeeAccessories.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeaccessories = state.employeeaccessories.filter(item => item.id !== action.payload);
      })
      .addCase(deleteEmployeeAccessories.rejected, (state) => {
        state.loading = false;
      });
    },
});
export default employeeaccessoriesSlice.reducer;

