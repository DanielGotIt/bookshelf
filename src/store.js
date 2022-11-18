import {configureStore} from '@reduxjs/toolkit'
import authReducer from 'slices/authSlice'
import {api} from 'services/book'
import {listItemApi} from 'services/listItem'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer,
    // [listItemApi.reducerPath]: listItemApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(api.middleware),
  //   .concat(listItemApi.middleware),
})
