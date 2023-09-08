'use client'

import { Roboto } from 'next/font/google'
import { createTheme } from '@mui/material/styles'
import type {} from '@mui/lab/themeAugmentation';

export const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
})

// Create a theme instance.
const theme = createTheme({
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'filled',
        fullWidth: true,
      },
    },
    MuiSelect: {
      defaultProps: {
        variant: 'filled',
        fullWidth: true,
      },
    },
    MuiButton: {
      defaultProps: {
        variant: 'contained',
        size: 'large',
      },
    },
    MuiLoadingButton: {
      defaultProps: {
        variant: 'contained',
        size: 'large',
      },
    },
    MuiTypography: {
      defaultProps: {
        color: 'text.primary',
      }
    }
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
})


export default theme