import {configureStore} from '@reduxjs/toolkit';
import officeSlice from './slices/officeSlice';
import employeeSlice from './slices/employeeSlice';
import roleSlice from './slices/roleSlice';
import accountdetailsSlice from './slices/accountdetailsSlice';
import departmentSlice from './slices/departmentSlice';
import roleDetailsSlice from './slices/roleDetailsSlice';
import brandSlice from './slices/brandSlice';
import consoleSlice from './slices/consoleSlice';
import productSlice from './slices/productSlice';
import accessoriesSlice from './slices/accessoriesSlice'

export const store = configureStore({
    devTools:true,
    reducer:{
        office: officeSlice,
        employee: employeeSlice,
        role: roleSlice,
        account:accountdetailsSlice,
        department:departmentSlice,
        roledetail:roleDetailsSlice,
        brand:brandSlice,
        consoles:consoleSlice,
        products:productSlice,
        accessories:accessoriesSlice,
    }
});

export default store;