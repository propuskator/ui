import React, {
    memo,
    useState,
    useEffect,
    useRef
}                 from 'react';
import PropTypes  from 'prop-types';
import classnames from 'classnames/bind';
import ClearIcon  from '@material-ui/icons/Clear';

import Chip       from '../Chip';
import Avatar     from '../../Avatar';
import IconButton from '../../IconButton';

import styles     from './ChipSubject.less';

const cx = classnames.bind(styles);

const CHIP_SIZES = {
    XXL : {
        avatar : 30,
        height : 13
    }
};


function ChipSubject({
    fullName,
    name,
    avatar,
    avatarColor,
    className,
    onDelete,
    disabled,
    isGroup,
    size,
    isArchived,
    renderTooltip,
    t
}) {
    // replace spaces with non-breaking space
    const fullNameStr      = fullName.replace(/\s/g, ' ');
    const isXXlChipSize    = size === 'XXL';

    const [ isOverflow, setIsOverflow ] = useState(false);
    const invisibleBlockRef             = useRef({});
    const XXL_CHIP_DATA = CHIP_SIZES?.XXL || {};

    useEffect(() => {
        if (!isXXlChipSize) return;
        const { scrollHeight } = invisibleBlockRef?.current || {};

        if (!scrollHeight) return;

        if (scrollHeight > XXL_CHIP_DATA.height) {
            setIsOverflow(true);
        }
    }, []);


    function getTooltipMode() {
        if (isArchived) return 'always';

        if (!isXXlChipSize) return 'always';

        return isOverflow ? 'always' : 'never';
    }

    function getChipContent() {
        return name;
    }

    const chipSubjectCN = cx(styles.ChipSubject, styles.Chip, {
        [className]     : true,
        [`size${size}`] : size,
        overflow        : isOverflow,
        archived        : isArchived
    });
    const chipStyle = {
        ...(isGroup ? {} : { borderColor: avatarColor })
    };
    const chipContent = getChipContent();

    return (
        <Chip
            size           = {isXXlChipSize ? 'XXL' : 'XL'}
            color          = {isXXlChipSize ? '' : 'grey'}
            variant        = 'outlined'
            isArchived     = {isArchived}
            t              = {t}
            tooltipMode    = {getTooltipMode()}
            tooltipContent = {renderTooltip ? renderTooltip() : fullNameStr}
            classes        = {{
                chipRoot  : chipSubjectCN,
                chipLabel : styles.chipLabel
            }}
            style          = {chipStyle}
        >
            <Avatar
                avatarUrl   = {avatar}
                avatarColor = {avatarColor}
                fullName    = {isGroup ? '' : name}
                size        = {isXXlChipSize ? XXL_CHIP_DATA.avatar : void 0}
                className   = {styles.avatar}
                variant     = {'rounded'}
                loaderColor = 'white'
            />
            <div className={styles.text}>
                <div className={styles.textContent}>
                    { chipContent }
                </div>
                {isXXlChipSize && !isArchived
                    ? (
                        <div
                            className = {styles.invisibleBlock}
                            ref       = {node => invisibleBlockRef.current = node}
                        >
                            {chipContent}
                        </div>
                    ) : null
                }
            </div>
            { onDelete
                ? (
                    <IconButton
                        disableRipple      = {disabled}
                        onClick            = {onDelete}
                        className          = {cx(styles.deleteButton, 'abort-submit')}
                    >
                        <ClearIcon fontSize='small' />
                    </IconButton>
                ) : null
            }
        </Chip>
    );
}

ChipSubject.propTypes = {
    fullName      : PropTypes.string.isRequired,
    name          : PropTypes.string,
    avatar        : PropTypes.string,
    avatarColor   : PropTypes.string,
    className     : PropTypes.string,
    isGroup       : PropTypes.bool,
    disabled      : PropTypes.bool,
    onDelete      : PropTypes.func,
    t             : PropTypes.func,
    size          : PropTypes.oneOf([ 'M', 'L', 'XL', 'XXL' ]),
    renderTooltip : PropTypes.func,
    isArchived    : PropTypes.bool
};

ChipSubject.defaultProps = {
    name          : '',
    avatar        : '',
    avatarColor   : '',
    t             : void 0,
    isGroup       : false,
    disabled      : false,
    isArchived    : false,
    onDelete      : void 0,
    className     : '',
    size          : 'XL',
    renderTooltip : void 0
};

export default memo(ChipSubject);
