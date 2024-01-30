import {configureStore} from '@reduxjs/toolkit';
import officeSlice from './slices/officeSlice';
import employeeSlice from './slices/employeeSlice';
import roleSlice from './slices/roleSlice';
import accountdetailsSlice from './slices/accountdetailsSlice';
import departmentSlice from './slices/departmentSlice';
import roleDetailsSlice from './slices/roleDetailsSlice';

export const store = configureStore({
    devTools:true,
    reducer:{
        office: officeSlice,
        employee: employeeSlice,
        role: roleSlice,
        account:accountdetailsSlice,
        department:departmentSlice,
        roledetail:roleDetailsSlice
    }
});

export default store;