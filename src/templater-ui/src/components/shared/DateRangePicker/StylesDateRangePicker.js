import COLORS, { THEMES } from '../../../assets/colors';

export function styles(theme) {    /* eslint-disable-line max-lines-per-function */
    const focusedRangeGradient     = `linear-gradient(to right, ${THEMES['100']}, ${THEMES['100']})`;
    const transparentRangeGradient = 'linear-gradient(to right, rgba(0,0,0,0.0), rgba(0,0,0,0.0))';
    const text = theme.palette.text;

    return {
        dateRangePickerDialog : {
            '& > * > *' : {
                borderRadius : '2px'
            },
            '& .MuiPickersCalendar-transitionContainer' : {
                minHeight : 218,
                marginTop : 10
            },
            '& .MuiPickersDatePickerRoot-toolbar' : {
                backgroundColor : 'white'
            },
            '& .MuiPickersYear-yearSelected' : {
                color : '#000'
            },
            '& .MuiPickersYear-yearDisabled' : {
                pointerEvents : 'none',
                color         : `${text.hint} !important`
            },
            '& .MuiPickersToolbarButton-toolbarBtn' : {
                marginTop                : 15,
                transition               : 'none',
                '& .MuiTouchRipple-root' : {
                    display : 'none'
                },
                '&:focus' : {
                    background : COLORS['C-GREY_LIGHT']
                },
                '&:hover' : {
                    background : 'transparent',
                    cursor     : 'default'
                }
            },
            '& .MuiTypography-subtitle1' : {
                color     : THEMES['500'],
                '&:focus' : {
                    color : COLORS['C-BLACK']
                },
                '&:hover' : {
                    background : COLORS['C-GREY_LIGHT'],
                    cursor     : 'pointer'
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
            '& .MuiPickersCalendarHeader-dayLabel' : {
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
        day : {
            width      : 40,
            height     : 36,
            fontSize   : theme.typography.caption.fontSize,
            margin     : 0,
            color      : text.primary,
            fontWeight : theme.typography.fontWeightMedium,
            padding    : 0,
            transition : 'none',
            '&::after' : {
                borderRadius : '100%',
                bottom       : 0,
                boxSizing    : 'border-box',
                content      : '""',
                height       : 36,
                width        : 36,
                left         : 0,
                margin       : 'auto',
                position     : 'absolute',
                right        : 0,
                top          : 0,
                transform    : 'scale(0)',
                zIndex       : 2
            },
            '&:hover' : {
                backgroundColor : 'transparent',
                color           : text.primary,
                '&::after'      : {
                    backgroundColor : theme.palette.background.paper,
                    border          : `2px solid ${THEMES['500']}`,
                    bottom          : -2,
                    left            : -2,
                    height          : 36,
                    width           : 36,
                    right           : -2,
                    top             : -2,
                    boxSizing       : 'content-box',
                    transform       : 'scale(1)'
                }
            },
            '& > .MuiIconButton-label' : {
                zIndex : 3
            }

        },
        hidden : {
            opacity       : 0,
            pointerEvents : 'none'
        },
        current : {
            color      : THEMES['500'],
            fontWeight : 500
        },
        focusedRange : {
            color        : THEMES['900'],
            background   : `${focusedRangeGradient} no-repeat 0/20px 40px, ${focusedRangeGradient} no-repeat 20px 0/20px 40px`,   // TODO: get rid of this eslint-disable-line
            fontWeight   : theme.typography.fontWeightMedium,    /* eslint-disable-line more/no-duplicated-chains */
            width        : 40,
            marginRight  : 0,
            marginLeft   : 0,
            borderRadius : 0
        },
        dayDisabled : {
            pointerEvents : 'none',
            color         : text.hint
        },
        yearDisabled : {
            pointerEvents : 'none',
            color         : text.hint
        },
        beginCap : {
            color      : THEMES['500'],
            '&::after' : {
                border          : `2px solid ${THEMES['500']}`,
                transform       : 'scale(1)',
                backgroundColor : '#FFF'
            }
        },
        endCap : {
            color      : THEMES['500'],
            '&::after' : {
                border          : `2px solid ${THEMES['500']}`,
                transform       : 'scale(1)',
                backgroundColor : '#FFF'
            }
        },
        'selectedDay' : {
            color      : '#FFF !important',
            '&::after' : {
                border          : `2px solid ${THEMES['500']}`,
                transform       : 'scale(1)',
                backgroundColor : `${THEMES['500']} !important`
            }
        },
        focusedFirst : {
            background : `${transparentRangeGradient} no-repeat 0/20px 40px,${focusedRangeGradient} no-repeat 20px 0/20px 40px`
        },
        focusedLast : {
            background : `${focusedRangeGradient} no-repeat 0/20px 40px,${transparentRangeGradient} no-repeat 20px 0/20px 40px`
        }
    };
}
