import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import Axios from 'axios';
import {ApiLink} from '../../apilinks/api';
import { faL } from '@fortawesome/free-solid-svg-icons';


const ApiName = 'holiday';
const ApiH= ApiLink.holiday;

//get
export const GetHoliday= createAsyncThunk(`${ApiName}/get${ApiName}`,async ()=>{
    return Axios.get(ApiH).then(res=> {return res.data});
});
//post
export const PostHoliday = createAsyncThunk(`${ApiName}/post${ApiName}`,async (data)=>{
    return Axios.post(ApiH,data).then(res=> {return res.data});
});
//put 
export const PutHoliday = createAsyncThunk(`${ApiName}/put${ApiName}`,async(data)=>{
    const {id,...restData} = data;   
    return Axios.put(`${ApiH}/${id}`,{id,...restData}).then(res=> res.data);
});
//delete
export const DeleteHoliday = createAsyncThunk(`${ApiName}/delete${ApiName}`,async(id)=>{
    return Axios.delete(`${ApiH}/${id}`).then(()=> id);
});

const HolidaySlice = createSlice({
    name:ApiName,
    initialState:{
        holiday:[],
        holidayloading:false
    },
    extraReducers:(builder)=>{
        builder
        //get
        .addCase(GetHoliday.pending,(state)=>{
            state.holidayloading = true;
        })
        .addCase(GetHoliday.fulfilled,(state,action)=>{
            state.holidayloading= false;
            state.holiday = action.payload;
        })
        .addCase(GetHoliday.rejected,(state)=>{
            state.holidayloading = false;
        })
        //Put
        .addCase(PutHoliday.pending,(state)=>{
            state.holidayloading = true;
        })
        .addCase(PutHoliday.fulfilled,(state,action)=>{
            state.holidayloading = false;
            state.holiday = state.holiday.map((data)=> data.id === action.payload.id ? action.payload : data);
        })
        .addCase(PutHoliday.rejected,(state)=>{
            state.holidayloading = false;
        })
        //Post
        .addCase(PostHoliday.pending,(state)=>{
            state.holidayloading = true;
        })
        .addCase(PostHoliday.fulfilled,(state,action)=>{
            state.holidayloading = false;
            state.holiday= [...state.holiday,action.payload];
        })
        .addCase(PostHoliday.rejected,(state)=>{
            state.holidayloading = false;
        })
         //Delete
         .addCase(DeleteHoliday.pending,(state)=>{
            state.holidayloading = true;
        })
        .addCase(DeleteHoliday.fulfilled,(state,action)=>{
            state.holidayloading = false;
            state.holiday = state.holiday.filter(data => data.id !== action.payload.id)
        })
        .addCase(DeleteHoliday.rejected,(state)=>{
            state.holidayloading = false;
        })
    }
});

export default HolidaySlice.reducer;