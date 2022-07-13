import { styled } from "@mui/material/styles";
import { Select } from '@mui/material'

export const InputSelect = styled(Select)(() => ({
    '& .MuiSelect-outlined': {
        paddingTop: 0,
        paddingBottom: 0,
        borderRadius: 8,
        width: 45
    },
}))