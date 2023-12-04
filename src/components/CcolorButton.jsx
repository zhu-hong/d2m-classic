import { Button, styled } from "@mui/material";

export const ColorButton = styled(Button)(({ ccolor }) => ({
  color: '#ffffff',
  backgroundColor: ccolor,
  minWidth: '144px',
  height: '100%',
  fontSize: '22px',
  fontWeight: '500',
  marginRight: '16px',
  '&:hover': {
    backgroundColor: ccolor,
  },
}))
