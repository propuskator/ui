import { makeStyles } from '@material-ui/core/styles';

const FOCUSED_BORDER_WIDTH = '1px';

export const useStyles = makeStyles(() => ({
    root : {
        '& > *' : {
            width : '100%'
        }
    },
    inputWrapper : {
        fontWeight   : 300,
        fontSize     : '13px',
        paddingRight : 0,

        '& > .MuiFormLabel-root.Mui-focused' : {
            color       : 'var(--color_primary--500)',
            borderColor : 'var(--color_primary--500)',
            maxWidth    : '100%'
        },
        '& > .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline' : {
            color       : 'var(--color_primary--500)',
            borderColor : 'var(--color_primary--500)'
        },
        '& .MuiFormHelperText-root' : {
            position : 'absolute',
            top      : '45px'
        },
        '& .MuiOutlinedInput-adornedEnd' : {
            paddingRight : '0'
        },
        '& .MuiOutlinedInput-adornedStart' : {
            paddingLeft : '0'
        },
        '&:hover .MuiFormLabel-filled' : {
            color : 'var(--color_primary--500)'
        },
        '& .MuiInputLabel-animated.MuiInputLabel-outlined.Mui-focused' : {
            width      : 'unset',
            background : 'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1), 57%, transparent 57%, transparent 100%)'
        }
    },
    input : {
        '& input:focus:valid + fieldset' : {
            borderColor : 'var(--color_primary--500)',
            borderWidth : FOCUSED_BORDER_WIDTH
        },
        '& input:focus:valid + .MuiInputAdornment-positionEnd' : {
            '& + fieldset' : {
                borderColor : 'var(--color_primary--500)',
                borderWidth : FOCUSED_BORDER_WIDTH
            }
        }
    }
}
));
