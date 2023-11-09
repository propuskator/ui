import COLORS, { THEMES } from '../../../../assets/colors';

export function styles() {
    return {
        timePickerDialog : {
            '& > * > *' : {
                borderRadius : '2px'
            },
            '& .MuiPickersCalendar-transitionContainer' : {
                minHeight : 218,
                marginTop : 10
            },
            '& .MuiPickersClock-pin, & .MuiPickersClockPointer-pointer, & .MuiPickersToolbar-toolbar, & .MuiPickersClockPointer-noPoint' : {
                backgroundColor : THEMES['500']
            },
            '& .MuiPickersClockPointer-thumb' : {
                border : `14px solid ${THEMES['500']}`
            },
            '& .MuiPickersYear-yearSelected' : {
                color : '#000'
            },
            '& .MuiPickersToolbarButton-toolbarBtn' : {
                marginTop                : 15,
                transition               : 'none',
                '& .MuiTouchRipple-root' : {
                    display : 'none'
                },
                '&:focus' : {
                    background : COLORS['C-GREY_LIGHT']
                }
            },
            '& .MuiTypography-subtitle1' : {
                color     : THEMES['500'],
                '&:focus' : {
                    color : COLORS['C-BLACK']
                }
            },
            '& .MuiTypography-h4' : {
                color             : COLORS['C-BLACK'],
                fontFamily        : 'Raleway, sans-serif',
                fontWeight        : 300,
                fontSize          : 18,
                '&::first-letter' : {
                    textTransform : 'capitalize'
                }
            },
            '& .MuiTypography-body1' : {
                textTransform : 'capitalize'
            },
            '& .MuiSvgIcon-root' : {
                fontSize : 36
            },
            '& .MuiPickersCalendarHeader-iconButton' : {
                padding : 0,
                margin  : '0 10px'
            },
            '& .MuiDialogActions-root' : {
                padding              : '8px 8px 16px 8px',
                '& .MuiButton-label' : {
                    color : THEMES['500']
                }
            }
        },
        hidden : {
            opacity       : 0,
            pointerEvents : 'none'
        },
        current : {
            color      : THEMES['500'],
            fontWeight : 500
        }
    };
}
