import Typography from '@mui/material/Typography'
import InputBase from '@mui/material/InputBase'

const LabeledInputBase = ({ label, type, ...props }) => {
  return (
    <>
      <Typography sx={{ marginBottom: '4px', fontSize: '14px' }}>{label}</Typography>
      <InputBase
        type={type}
        sx={{
          width: '100%',
          padding: '4px 18px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          '&:focus': {
            borderColor: 'primary.main',
          },
        }}
        {...props}
      />
    </>
  )
}

export default LabeledInputBase
