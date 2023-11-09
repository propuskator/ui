import React, { PureComponent }               from 'react';
import PropTypes                              from 'prop-types';
import classnames                             from 'classnames/bind';

import BaseSvgIcon                            from 'templater-ui/src/components/base/SvgIcon';

import { ReactComponent as RFID }             from '../../../assets/icons/rfid.svg';
import { ReactComponent as NFC }              from '../../../assets/icons/nfc.svg';
import { ReactComponent as Calendar }         from '../../../assets/icons/calendar.svg';
import { ReactComponent as Status }           from '../../../assets/icons/status.svg';
import { ReactComponent as Settings }         from '../../../assets/icons/settings.svg';
import { ReactComponent as Camera }           from '../../../assets/icons/camera.svg';
import { ReactComponent as TokenReader }      from '../../../assets/icons/tokenReader.svg';
import { ReactComponent as CsvFiles }         from '../../../assets/icons/csvFiles.svg';
import { ReactComponent as Video }            from '../../../assets/icons/video.svg';
import { ReactComponent as Picture }          from '../../../assets/icons/picture.svg';
import { ReactComponent as Arrow }            from '../../../assets/icons/arrow.svg';
import { ReactComponent as SadMobile }        from '../../../assets/icons/sadMobile.svg';

// sidebar start
import { ReactComponent as Access }           from '../../../assets/icons/sidebar/access.svg';
import { ReactComponent as AccessPoints }     from '../../../assets/icons/sidebar/accessPoints.svg';
import { ReactComponent as AccessGroups }     from '../../../assets/icons/sidebar/accessGroups.svg';
import { ReactComponent as Subjects }         from '../../../assets/icons/sidebar/subjects.svg';
import { ReactComponent as Time }             from '../../../assets/icons/sidebar/time.svg';
import { ReactComponent as AccessLogs }       from '../../../assets/icons/sidebar/accessLogs.svg';
import { ReactComponent as Marks }            from '../../../assets/icons/sidebar/marks.svg';
import { ReactComponent as Cameras }          from '../../../assets/icons/sidebar/cameras.svg';
import { ReactComponent as ApiSettings }      from '../../../assets/icons/sidebar/apiSettings.svg';
// sidebar end
import { ReactComponent as Logo }             from '../../../assets/icons/logo.svg';
import { ReactComponent as LogoRU }           from '../../../assets/icons/logoRU.svg';
import { ReactComponent as LogoEN }           from '../../../assets/icons/logoEN.svg';
import { ReactComponent as LogoUA }           from '../../../assets/icons/logoUA.svg';
import { ReactComponent as Rectangle }        from '../../../assets/icons/rectangle.svg';
import { ReactComponent as RectangleFilled }  from '../../../assets/icons/rectangleFilled.svg';
import { ReactComponent as ConnectionError }  from '../../../assets/icons/connectionError.svg';
import { ReactComponent as Play }             from '../../../assets/icons/player/play.svg';
import { ReactComponent as Stop }             from '../../../assets/icons/player/stop.svg';
import { ReactComponent as Pause }            from '../../../assets/icons/player/pause.svg';
import { ReactComponent as Volume }           from '../../../assets/icons/player/volume.svg';
import { ReactComponent as ExitButton }       from '../../../assets/icons/exitButton.svg';

import styles                                 from './SvgIcon.less';

const cx = classnames.bind(styles);

const SIDEBAR_ICONS = {
    access       : Access,
    accessPoints : AccessPoints,
    accessGroups : AccessGroups,
    subjects     : Subjects,
    time         : Time,
    accessLogs   : AccessLogs,
    marks        : Marks,
    apiSettings  : ApiSettings,
    cameras      : Cameras
};

const SVG_BY_TYPE = {
    ...SIDEBAR_ICONS,
    nfc             : NFC,
    rfid            : RFID,
    calendar        : Calendar,
    status          : Status,
    settings        : Settings,
    logo            : Logo,
    logoRU          : LogoRU,
    logoEN          : LogoEN,
    logoUA          : LogoUA,
    rectangle       : Rectangle,
    rectangleFilled : RectangleFilled,
    camera          : Camera,
    connectionError : ConnectionError,
    play            : Play,
    stop            : Stop,
    pause           : Pause,
    volume          : Volume,
    tokenReader     : TokenReader,
    csvFiles        : CsvFiles,
    exitButton      : ExitButton,
    video           : Video,
    picture         : Picture,
    arrow           : Arrow,
    sadMobile       : SadMobile
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
            ''
        ])
    }

    static defaultProps = {
        type      : '',
        className : '',
        disabled  : false,
        onClick   : void 0,
        size      : void 0,
        color     : 'default'
    }

    render() {
        const { type, className, disabled, onClick, color } = this.props;

        const svgIconCN = cx({
            SvgIcon     : true,
            [type]      : type,
            [className] : className,
            [color]     : color,
            clickable   : onClick,
            disabled
        });

        const CustomSvg = SVG_BY_TYPE[type];

        if (CustomSvg) {
            return (
                <BaseSvgIcon
                    {...this.props}
                    className = {svgIconCN}
                    svg       = {CustomSvg}
                />
            );
        }

        return (
            <BaseSvgIcon
                {...this.props}
                className = {svgIconCN}
            />
        );
    }
}

export default SvgIcon;
