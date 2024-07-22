import TextField from '@mui/material/TextField'

const SearchBar = ({ searchQuery, handleSearchChange }) => {
  return (
    <TextField
      variant="outlined"
      placeholder="Search…"
      value={searchQuery}
      onChange={handleSearchChange}
      sx={{ width: '300px' }}
    />
  )
}

export default SearchBar
