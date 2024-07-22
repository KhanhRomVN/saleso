import { experimental_extendTheme as extendTheme } from '@mui/material/styles'

const theme = extendTheme({
  other: {
    headerBarHeight: '61px',
    sideBarWidth: '220px',
    primaryColor: '#0c68e9',
    redColor: '#ed3f15',
    yellowColor: '#fba94b',
    greenColor: '#31ae60',
    pinkColor: '#DE3163',
    grayColor: '#DBD7D2',
  },
  colorSchemes: {
    light: {
      palette: {
        backgroundColor: {
          primary: '#ffffff',
          secondary: '#e8e8e8',
        },
        textColor: {
          primary: '#000000',
          secondary: '#929297',
        },
        hoverColor: {
          primary: '#ffffff',
          secondary: '#ffffff',
        },
      },
    },
    dark: {
      palette: {
        backgroundColor: {
          primary: '#111315',
          secondary: '#1a1d1f',
        },
        textColor: {
          primary: '#ffffff',
          secondary: '#383940',
        },
        hoverColor: {
          primary: '#272b30',
          secondary: '#18171c',
        },
      },
    },
  },
})

export default theme
