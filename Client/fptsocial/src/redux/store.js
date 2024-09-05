import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { userReducer } from './user/userSlice'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { activePostReducer } from './activePost/activePostSlice'
import { uiStateReducer } from './ui/uiSlice'
import { notificationReducer } from './notification/notificationSlice'
import { sideDataReducer } from './sideData/sideDataSlice'
import { activeGroupReducer } from './activeGroup/activeGroupSlice'
import { activeListPostReducer } from './activeListPost/activeListPostSlice'
import { reportReducer } from './report/reportSlice'
import { blockReducer } from './block/blockSlice'

const rootPersistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['user']
  // blacklist: ['user']
}

const reducers = combineReducers({
  user: userReducer,
  activeListPost: activeListPostReducer,
  activePost: activePostReducer,
  activeGroup: activeGroupReducer,
  uiState: uiStateReducer,
  notification: notificationReducer,
  sideData: sideDataReducer,
  report: reportReducer,
  block: blockReducer
})
const persistedReducers = persistReducer(rootPersistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducers,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})