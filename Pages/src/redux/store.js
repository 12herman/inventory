import {configureStore} from '@reduxjs/toolkit';
import officeSlice from './slices/officeSlice';
import employeeSlice from './slices/employeeSlice';
import roleSlice from './slices/roleSlice';
import accountdetailsSlice from './slices/accountdetailsSlice';
import departmentSlice from './slices/departmentSlice';
import roleDetailsSlice from './slices/roleDetailsSlice';
import brandSlice from './slices/brandSlice';
import consoleSlice from './slices/consoleSlice';
import accessoriesSlice from './slices/accessoriesSlice'
import addressSlice from './slices/addressSlice';
import holidaySlice from './slices/holidaySlice';
import employeeLeaveSlice from './slices/employeeLeaveSlice';
import productsDetailSlice from './slices/productsDetailSlice';
import productStorageLocationSlice from './slices/productStorageLocationSlice';
import leaderEmployeeSlice from './slices/leaderEmployeeSlice';
import loginSlice from './slices/loginSlice';
import leaveTableSlice from './slices/leaveTableSlice';
import otpApiSlice from './slices/otpApiSlice';
import employeeaccessoriesSlice from './slices/employeeaccessoriesSlice';

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
        accessories:accessoriesSlice,
        address:addressSlice,
        holiday:holidaySlice,
        employeeleave:employeeLeaveSlice,
        productsDetail:productsDetailSlice,
        productstoragelocation:productStorageLocationSlice,
        leaderemployee:leaderEmployeeSlice,
        login:loginSlice,
        leavetable:leaveTableSlice,
        otpapi:otpApiSlice,
        employeeaccessories:employeeaccessoriesSlice
    }
});

export default store;