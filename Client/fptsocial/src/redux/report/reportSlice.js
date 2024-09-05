import { createSlice } from '@reduxjs/toolkit'

export const reportSlice = createSlice({
  name: 'report',
  initialState: {
    reportData: null,
    reportType: null,
    isOpenReport: false
  },
  reducers: {
    openModalReport: (state) => {
      state.isOpenReport = true
    },
    addReport: (state, action) => {
      state.reportData = action.payload.reportData
      state.reportType = action.payload.reportType
    },
    clearReport: (state) => {
      state.reportData = null
      state.reportType = null
      state.isOpenReport = false
    }
  },
  extraReducers: (builder) => { }
})

export const {
  openModalReport,
  addReport,
  clearReport
} = reportSlice.actions

export const selectReportData = (state) => {
  return state.report.reportData
}
export const selectReportType = (state) => {
  return state.report.reportType
}
export const selectIsOpenReport = (state) => {
  return state.report.isOpenReport
}

export const reportReducer = reportSlice.reducer