import { configureStore } from '@reduxjs/toolkit'
import workingReducer from '../working/workingSlice'

export default configureStore({
  reducer: {
    quiz : workingReducer
  }
})