import {configureStore} from '@reduxjs/toolkit';
import officeSlice from './slices/officeSlice';
import employeeSlice from './slices/employeeSlice';
import roleDetailSlice from './slices/roleDetailSlice';
import accountdetailsSlice from './slices/accountdetailsSlice';
import departmentSlice from './slices/departmentSlice';

export const store = configureStore({
    devTools:true,
    reducer:{
        office: officeSlice,
        employee: employeeSlice,
        roledetails: roleDetailSlice,
        account:accountdetailsSlice,
        department:departmentSlice
    }
});

export default store;