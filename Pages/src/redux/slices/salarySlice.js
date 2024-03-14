import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import Axios from 'axios';
import {ApiLink} from '../../apilinks/api'

export const getSalary = createAsyncThunk('get/getSalary',async()=>{
    return Axios.get(ApiLink.salary)
                .then(res => {return res.data}); 
});

export const postSalary = createAsyncThunk('salary/postSalary', async (newProductData) => {
    console.log(newProductData);
    return Axios.post(ApiLink.salary, newProductData)
        .then(res => {
            return res.data 
        });        
});

export const putSalary = createAsyncThunk('salary/putSalary', async (updatedProductData) => {
    const { id, ...restData } = updatedProductData;
    try {
        const response = await Axios.put(`${ApiLink.salary}/${id}`, { id, ...restData });
        console.log(response.data); // Log the response data
        return response.data;
    } catch (error) {
        console.error('Error updating product:', error);
        // Handle the error appropriately
        // You might want to throw an error or return a specific error structure
        throw error;
    }
});

export const deleteSalary = createAsyncThunk('salary/deleteSalary', async (id) => {
    return Axios.delete(`${ApiLink.salary}/${id}`)
                .then(() => id);
  });

const salarySlice = createSlice({
    name:"salary",
    initialState: {
        salary:[],       
        loading:false,
    },
    // reducers:{},
    extraReducers:(builder)=>{
        builder
        //Get Method
        .addCase(getSalary.pending,(state)=>{
            state.loading = true;
            // console.log('getProducts is pending');
        })
        .addCase(getSalary.fulfilled,(state,action)=>{
            state.loading = false;
            state.salary = action.payload;
            // console.log('getProducts fulfilled. Updated products:', state.productsDetail);
        })
        .addCase(getSalary.rejected,(state,action)=>{
            state.loading = false;
            //state.error = action.error.message || 'An error occured';
            //console.log('Error Fetching Data:',action.error);
        })

        //Post Method
        .addCase(postSalary.pending, (state) => {
            state.loading = true;
        })
        .addCase(postSalary.fulfilled, (state, action) => {
            state.loading = false;
            state.salary = [...state.salary, action.payload]
        })
        .addCase(postSalary.rejected, (state) => {
            state.loading = false;
        })

         // Put method
         .addCase(putSalary.pending, (state) => {
            state.loading = true;
        })
        .addCase(putSalary.fulfilled, (state, action) => {
            state.loading = false;
            state.salary = state.salary.map((item) => item.id === action.payload.id ? action.payload : item);
            console.log(state.salary);
        })
        .addCase(putSalary.rejected, (state) => {
            state.loading = false;
        })

        // Delete method
      .addCase(deleteSalary.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSalary.fulfilled, (state, action) => {
        state.loading = false;
        state.salary = state.salary.filter(item => item.id !== action.payload);
      })
      .addCase(deleteSalary.rejected, (state) => {
        state.loading = false;
      });
    },
});
export default salarySlice.reducer;

