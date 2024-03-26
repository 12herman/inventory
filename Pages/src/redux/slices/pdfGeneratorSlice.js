import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';
import { ApiLink } from '../../apilinks/api';

const apiName = 'pdfgenerator';
const apilink = ApiLink.pdfGenerator;

// Action creator to download PDF
export const downloadPdf = () => async (dispatch) => {
  try {
    const response = await Axios.post(apilink, { "name": "Herman",
    "accountNo": "123456765",
    "dateOfJoining": "16/12/2024",
    "netSalary": "12,000",
    "officeAddress": "35/5, West Street, Thoothukudi",
    "paySlipMonth": "Feb 2024",
    "salaryWords": "Twelve Thousand",
    "departmentName": "IT" });
    const pdfUrl = window.URL.createObjectURL(new Blob([response.data]));
    window.open(pdfUrl, '_blank'); // Open PDF in a new tab
  } catch (error) {
    console.error('Error downloading PDF:', error);
    // Dispatch an action to handle error if needed
  }
};

// Async thunk for posting PDF
export const PostPdf = createAsyncThunk(`${apiName}/post${apiName}`, async (data) => {
  const response = await Axios.post(apilink, data);
  return response.data;
});

const pdfGeneratorSlice = createSlice({
  name: apiName,
  initialState: {
    pdfGenerator: null,
    pdfGeneratorLoading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(PostPdf.pending, (state) => {
        state.pdfGeneratorLoading = true;
      })
      .addCase(PostPdf.fulfilled, (state, action) => {
        state.pdfGeneratorLoading = false;
        state.pdfGenerator = action.payload;
      })
      .addCase(PostPdf.rejected, (state) => {
        state.pdfGeneratorLoading = false;
      });
  },
});

export default pdfGeneratorSlice.reducer;
