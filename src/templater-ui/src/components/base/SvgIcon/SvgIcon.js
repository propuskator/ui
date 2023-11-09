import React, { PureComponent }           from 'react';
import PropTypes                          from 'prop-types';
import classnames                         from 'classnames/bind';

import { ReactComponent as ThemeIcon }            from '../../../assets/icons/theme.svg';
import { ReactComponent as Calendar }             from '../../../assets/icons/calendar.svg';
import { ReactComponent as EmptyList }            from '../../../assets/icons/emptyList.svg';
import { ReactComponent as NothingFound }         from '../../../assets/icons/nothingFound.svg';
import { ReactComponent as Settings }             from '../../../assets/icons/settings.svg';
import { ReactComponent as Bell }                 from '../../../assets/icons/bell.svg';
import { ReactComponent as User }                 from '../../../assets/icons/user.svg';
import { ReactComponent as Menu }                 from '../../../assets/icons/menu.svg';
import { ReactComponent as Close }                from '../../../assets/icons/close.svg';
import { ReactComponent as ErrorIcon }            from '../../../assets/icons/error.svg';
import { ReactComponent as Success }              from '../../../assets/icons/success.svg';
import { ReactComponent as Cross }                from '../../../assets/icons/cross.svg';
import { ReactComponent as PlusButton }           from '../../../assets/icons/plusButton.svg';
import { ReactComponent as MinusButton }          from '../../../assets/icons/minusButton.svg';
import { ReactComponent as Exit }                 from '../../../assets/icons/exit.svg';
import { ReactComponent as Search }               from '../../../assets/icons/search.svg';
import { ReactComponent as Info }                 from '../../../assets/icons/info.svg';
import { ReactComponent as Changelog }            from '../../../assets/icons/changelog.svg';
import { ReactComponent as Global }               from '../../../assets/icons/global.svg';
import { ReactComponent as AddSingle }            from '../../../assets/icons/addSingle.svg';
import { ReactComponent as AddMultiple }          from '../../../assets/icons/addMultiple.svg';
import { ReactComponent as Add }                  from '../../../assets/icons/add.svg';
import { ReactComponent as Visible }              from '../../../assets/icons/visible.svg';
import { ReactComponent as Invisible }            from '../../../assets/icons/invisible.svg';
import { ReactComponent as Google }               from '../../../assets/icons/google.svg';
import { ReactComponent as Facebook }             from '../../../assets/icons/facebook.svg';
import { ReactComponent as ActiveMotionSensor }   from '../../../assets/icons/activeMotionSensor.svg';
import { ReactComponent as InactiveMotionSensor } from '../../../assets/icons/inactiveMotionSensor.svg';
import { ReactComponent as Product }              from '../../../assets/icons/product.svg';
import { ReactComponent as CopyButton }           from '../../../assets/icons/copyButton.svg';

// sidebar start
import { ReactComponent as Products }     from '../../../assets/icons/sidebar/products.svg';
import { ReactComponent as Dashboard }    from '../../../assets/icons/sidebar/dashboard.svg';
import { ReactComponent as Firmwares }    from '../../../assets/icons/sidebar/firmwares.svg';
import { ReactComponent as Layouts }      from '../../../assets/icons/sidebar/layouts.svg';
import { ReactComponent as Statistics }   from '../../../assets/icons/sidebar/statistics.svg';
import { ReactComponent as Link }         from '../../../assets/icons/sidebar/link.svg';
// sidebar end
import { ReactComponent as Logo }                    from '../../../assets/icons/logo.svg';
import { ReactComponent as CreateEntity }            from '../../../assets/icons/createEntity.svg';
import { ReactComponent as Check }                   from '../../../assets/icons/check.svg';
import { ReactComponent as CheckOutlined }           from '../../../assets/icons/checkOutlined.svg';
import { ReactComponent as Edit }                    from '../../../assets/icons/edit.svg';
import { ReactComponent as Bin }                     from '../../../assets/icons/bin.svg';
import { ReactComponent as Photo }                   from '../../../assets/icons/photo.svg';
import { ReactComponent as SuccessGreen }            from '../../../assets/icons/successGreen.svg';
import { ReactComponent as ErrorRed }                from '../../../assets/icons/errorRed.svg';
import { ReactComponent as SecurityAlarmLog }        from '../../../assets/icons/securityAlarmLog.svg';
import { ReactComponent as SecurityAlarmNotify }     from '../../../assets/icons/securityAlarmNotify.svg';
import { ReactComponent as UserRegistrationRequest } from '../../../assets/icons/userRegistrationRequest.svg';
import { ReactComponent as ThemeSelect }             from '../../../assets/icons/themeSelect.svg';
import { ReactComponent as ZipIcon }                 from '../../../assets/icons/zip.svg';
import { ReactComponent as UnzipIcon }               from '../../../assets/icons/unzip.svg';
import { ReactComponent as Csv }                     from '../../../assets/icons/csv.svg';
import { ReactComponent as Download }                from '../../../assets/icons/download.svg';
import { ReactComponent as Copy }                    from '../../../assets/icons/copy.svg';
import { ReactComponent as Lock }                    from '../../../assets/icons/lock.svg';
import { ReactComponent as LockOpened }              from '../../../assets/icons/lock-opened.svg';
import { ReactComponent as Caution }                 from '../../../assets/icons/caution.svg';
import { ReactComponent as Email }                   from '../../../assets/icons/email.svg';
import { ReactComponent as Mail }                    from '../../../assets/icons/mail.svg';
// arrows
import { ReactComponent as SortArrow }       from '../../../assets/icons/arrows/sortArrow.svg';
import { ReactComponent as ArrowDown }       from '../../../assets/icons/arrows/arrowDown.svg';
import { ReactComponent as ArrowDownFilled } from '../../../assets/icons/arrows/arrowDownFilled.svg';
import { ReactComponent as ExpansionArrow }  from '../../../assets/icons/arrows/expansionArrow.svg';
import { ReactComponent as ArrowRightThin }  from '../../../assets/icons/arrows/arrowRightThin.svg';

import { ReactComponent as PhotoSecondary }  from '../../../assets/icons/photoSecondary.svg';

import styles                                 from './SvgIcon.less';

const cx = classnames.bind(styles);

const ARROWS_ICONS = {
    sortArrow       : SortArrow,
    arrowDown       : ArrowDown,
    expansionArrow  : ExpansionArrow,
    arrowDownFilled : ArrowDownFilled,
    arrowRightThin  : ArrowRightThin
};

const SIDEBAR_ICONS = {
    products   : Products,
    dashboard  : Dashboard,
    firmwares  : Firmwares,
    layouts    : Layouts,
    statistics : Statistics,
    link       : Link
};

const SVG_BY_TYPE = {
    ...SIDEBAR_ICONS,
    ...ARROWS_ICONS,
    theme                   : ThemeIcon,
    calendar                : Calendar,
    emptyList               : EmptyList,
    nothingFound            : NothingFound,
    settings                : Settings,
    bell                    : Bell,
    user                    : User,
    menu                    : Menu,
    close                   : Close,
    success                 : Success,
    successGreen            : SuccessGreen,
    error                   : ErrorIcon,
    errorRed                : ErrorRed,
    securityAlarmLog        : SecurityAlarmLog,
    securityAlarmNotify     : SecurityAlarmNotify,
    userRegistrationRequest : UserRegistrationRequest,
    cross                   : Cross,
    logo                    : Logo,
    plusButton              : PlusButton,
    minusButton             : MinusButton,
    createEntity            : CreateEntity,
    check                   : Check,
    checkOutlined           : CheckOutlined,
    edit                    : Edit,
    bin                     : Bin,
    photo                   : Photo,
    themeSelect             : ThemeSelect,
    zip                     : ZipIcon,
    unzip                   : UnzipIcon,
    csv                     : Csv,
    download                : Download,
    copy                    : Copy,
    lock                    : Lock,
    lockOpened              : LockOpened,
    exit                    : Exit,
    search                  : Search,
    info                    : Info,
    caution                 : Caution,
    email                   : Email,
    mail                    : Mail,
    global                  : Global,
    changelog               : Changelog,
    addSingle               : AddSingle,
    addMultiple             : AddMultiple,
    add                     : Add,
    visible                 : Visible,
    invisible               : Invisible,
    google                  : Google,
    facebook                : Facebook,
    activeMotionSensor      : ActiveMotionSensor,
    inactiveMotionSensor    : InactiveMotionSensor,
    product                 : Product,
    photoSecondary          : PhotoSecondary,
    copyButton              : CopyButton
};


class SvgIcon extends PureComponent {
    static propTypes = {
        type      : PropTypes.string,
        className : PropTypes.string,
        disabled  : PropTypes.bool,
        onClick   : PropTypes.func,
        size      : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
        color     : PropTypes.oneOf([
            'primary900',
            'primary700',
            'primary600',
            'primary500',
            'greyLight',
            'greyMedium',
            'greyDark',
            'white',
            'black',
            'default',
            'yellow',
            'red',
            'green',
            'primaryGreen',
            'orange',
            'darkOrange',
            ''
        ]),
        svg : PropTypes.func
    }

    static defaultProps = {
        type      : '',
        className : '',
        disabled  : false,
        onClick   : void 0,
        size      : void 0,
        color     : 'default',
        svg       : void 0
    }

    handleClick = e => {
        const { onClick } = this.props;

        if (onClick) onClick(e);
    }

    render() {
        const { type, className, disabled, onClick, size, color, svg } = this.props;

        const svgIconCN = cx({
            SvgIcon     : true,
            [type]      : type,
            [className] : className,
            [color]     : color,
            clickable   : onClick,
            disabled
        });

        const Svg = svg || SVG_BY_TYPE[type];

        if (!Svg) return null;

        return (
            <Svg
                style = {size && {
                    width  : size,
                    height : size
                }}
                className = {svgIconCN}
                onClick   = {this.handleClick}
            />
        );
    }
}

export default SvgIcon;
