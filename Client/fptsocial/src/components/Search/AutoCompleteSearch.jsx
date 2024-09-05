import { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
// import SearchIcon from '@mui/icons-material/Search'
import { createSearchParams, useNavigate } from 'react-router-dom'
// import { fetchBoardsAPI } from '~/apis'
import { useDebounceFn } from '~/customHooks/useDebounceFn'
import { IconSearch } from '@tabler/icons-react'
import { searchAll } from '~/apis'
import { Avatar, Box, ListItem, ListItemAvatar, ListItemText } from '@mui/material'

function AutoCompleteSearch() {
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const [searchResult, setSearchResult] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) { setSearchResult(null) }
  }, [open])

  const handleInputSearchChange = (event) => {
    const searchValue = event.target?.value
    if (!searchValue) return

    // const searchPath = `?${createSearchParams({ 'q[title]': searchValue })}`

    setLoading(true)
    searchAll({ search: searchValue })
      .then(res => {
        setSearchResult([...res.userProfiles] || [])
      })
      .finally(() => {
        setLoading(false)
      })
  }
  const debounceSearchBoard = useDebounceFn(handleInputSearchChange, 1000)

  const handleSelectedBoard = (event, selectedBoard) => {
    if (selectedBoard) {
      navigate(`/boards/${selectedBoard._id}`)
    }
  }

  return (
    <Autocomplete
      sx={{ width: 220 }}
      id="asynchronous-search-board"
      noOptionsText={!searchResult ? 'Type to search ...' : 'Data not found!'}
      open={open}
      onOpen={() => { setOpen(true) }}
      onClose={() => { setOpen(false) }}
      getOptionLabel={(result) => result.userName}
      options={searchResult || []}
      // isOptionEqualToValue={(option, value) => option.title === value.title}
      loading={loading}
      onInputChange={debounceSearchBoard}
      onChange={handleSelectedBoard}
      renderOption={(props, option) => (
        <ListItem {...props}>
          <ListItemAvatar>
            <Avatar src={option.avataUrl} />
          </ListItemAvatar>
          <div className='flex flex-col'>
            <ListItemText primary={option.userName} />
            <ListItemText primary={'User'} />
          </div>
        </ListItem>
      )}

      renderInput={(params) => (
        <TextField
          {...params}
          label="Type to search..."
          size="small"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <IconSearch className='text-orangeFpt' />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {loading ? <CircularProgress sx={{ color: 'white' }} size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            )
          }}
          sx={{
            '& label': { color: '#F27125' },
            '& input': { color: '#F27125' },
            '& label.Mui-focused': { color: '#F27125' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#F27125' },
              '&:hover fieldset': { borderColor: '#F27125' },
              '&.Mui-focused fieldset': { borderColor: '#F27125' }
            },
            '.MuiSvgIcon-root': { color: '#F27125' }
          }}
        />
      )}
    />
  )
}

export default AutoCompleteSearch
