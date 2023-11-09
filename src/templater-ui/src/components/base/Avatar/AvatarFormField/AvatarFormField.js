/* eslint-disable no-magic-numbers */
import React, {
    memo,
    useRef,
    useState,
    useEffect,
    useCallback
}                       from 'react';
import PropTypes        from 'prop-types';
import classnames       from 'classnames/bind';

import {
    getScreenParams
}                       from '../../../../utils/screen';
import globalEscHandler from '../../../../utils/eventHandlers/globalEscHandler';
import {
    checkIsTouchDevice
}                       from '../../../../utils/helpers/detect';
import * as KEY_CODES   from '../../../../constants/keyCodes';
import Image            from '../../Image';
import Typography       from '../../Typography';
import SvgIcon          from '../../SvgIcon';
import Loader           from '../../Loader';
import DropdownMenu     from '../../Dropdown/DropdownMenu';

import styles           from './AvatarFormField.less';

const cx = classnames.bind(styles);

const IS_TOUCH_DEVICE = checkIsTouchDevice();
const IMAGE_SIZE = {
    width  : 180,
    height : 180
};

function AvatarFormField(props) {   /* eslint-disable-line max-lines-per-function */
    const {
        label,
        labelPlacement,
        size,
        className,
        addToast,
        isProcessing,
        value: avatarUrl,
        onChange,
        name,
        disabled,
        availableFormats,
        accept,
        variant,
        pictureVariant,
        uploadOptionLabel,
        t,
        tipMessage,
        extensionMessage
    } = props;

    const [ avatarPreview, setAvatarPreview ] = useState();
    const [ isMenuOpen, setIsMenuOpen ]       = useState(false);
    const [ menuStyles, setMenuStyles ]       = useState({});

    const uploadInputRef    = useRef({});
    const avatarRef         = useRef({});

    useEffect(() => {
        setAvatarPreview('');
    }, [ avatarUrl ]);

    useEffect(() => {
        function handleCloseByEsc() {
            setIsMenuOpen(false);
        }

        if (isMenuOpen) globalEscHandler.register(handleCloseByEsc);

        return () => {
            globalEscHandler.unregister(handleCloseByEsc);
        };
    }, [ isMenuOpen ]);

    useEffect(() => {
        document.addEventListener('mousedown', handleKeyPressed);
        document.addEventListener('keydown', handleKeyPressed);

        return () => {
            document.removeEventListener('mousedown', handleKeyPressed);
            document.removeEventListener('keydown', handleKeyPressed);
        };
    }, []);

    function getMenuOptions() {
        const options = [ {
            value : 'upload',
            label : uploadOptionLabel || `${t('Upload new file')}${extensionMessage}`
        }, {
            value : 'delete',
            label : t('Delete')
        } ];

        return !avatarUrl ? options.filter(option => option.value !== 'delete') : options;
    }

    function handleKeyPressed(e) {
        if (e.keyCode === KEY_CODES.TAB) {
            handleCloseMenu();
        }
    }

    function handleOpenMenu() {
        setIsMenuOpen(true);
    }

    function handleCloseMenu() {
        setIsMenuOpen(false);
    }

    function startFileUpload(e) {
        if (e) e.preventDefault();
        if (e) e.stopPropagation();

        uploadInputRef.current.click();
        uploadInputRef.current.focus();
    }

    function handleSelectMenuItem(id) {
        if (id === 'upload') startFileUpload();
        else if (id === 'delete') {
            setAvatarPreview('');
            onChange({ name, value: '' });
        }

        handleCloseMenu();
    }

    async function handleFilesSelect(e) {
        e.preventDefault();
        e.stopPropagation();

        const { files } = e.target;

        if (!files.length) return;

        const avatarFile = files[0];

        const AVAILABLE_TYPES = availableFormats && availableFormats?.length
            ? availableFormats
            : [
                'image/jpeg',
                'image/jpg',
                'image/png'
            ];

        const isValidFileType = AVAILABLE_TYPES.includes(avatarFile.type);

        if (!isValidFileType) {
            addToast({
                key     : 'fileUpload',
                title   : t('File upload error'),
                message : `${t('Invalid file format in attachment:')} \n${avatarFile.name}`,
                type    : 'error'
            });

            return e.target.value = '';
        }

        const fileSize = avatarFile.size / 1024 / 1024; // in Mb
        const MAX_FILE_SIZE_IN_MB = 5;
        const isMaxSizeError = fileSize > MAX_FILE_SIZE_IN_MB;

        if (isMaxSizeError) {
            addToast({
                key     : 'fileUpload',
                title   : t('File upload error'),
                message : t('The maximum file size has been exceeded. Please select a file less than 5 Mb'),
                type    : 'error'
            });

            return e.target.value = '';         // eslint-disable-line more/no-duplicated-chains
        }

        onChange({ name, value: avatarFile });

        const reader = new FileReader();

        reader.onload = function onLoadAvatar(event) {
            setAvatarPreview(event.target.result);
        };

        reader.readAsDataURL(avatarFile);

        e.target.value = '';        // eslint-disable-line more/no-duplicated-chains
    }

    function openMenu(e) {
        if (e) e.preventDefault();
        if (e) e.stopPropagation();
        if (isProcessing) return;
        const nodeData = avatarRef.current.getBoundingClientRect();

        const isEnLang = t('Edit')?.length === 4;

        handleOpenMenu();
        // const menuTopOffset = size === 'L' ? 10 : 5;
        const menuTopOffset = 10;
        const menuWidth = isEnLang ? 170 : 180;
        const menuLeft  = nodeData.left + (nodeData.width / 2) - (menuWidth / 2);
        const menuTop   = nodeData.top + nodeData.height + menuTopOffset;
        const menuHeight = 70;

        const modalLeftEnd = menuLeft + menuWidth;

        const { height, width } = getScreenParams();
        const MENU_OFFSET = 10;

        const isOverflowLeft = MENU_OFFSET > menuLeft;
        const isOverflowRight = modalLeftEnd > (width - MENU_OFFSET);

        let correctLeft = menuLeft;

        if (isOverflowLeft || isOverflowRight) {
            correctLeft = isOverflowRight ? width - MENU_OFFSET - menuWidth : MENU_OFFSET;
        }

        const isOpenToBottom = height > menuTop + menuHeight + MENU_OFFSET;
        const correctMenuTop = isOpenToBottom
            ? menuTop
            : menuTop - menuHeight;

        setMenuStyles({
            top   : `${Math.round(correctMenuTop)}px`,
            left  : `${Math.round(correctLeft)}px`,
            width : `${Math.round(menuWidth)}px`
        });
    }
    const withImage = avatarUrl || avatarPreview;
    const avatarFormFieldCN = cx(styles.AvatarFormField, {
        withLabel                    : label,
        [`size${size}`]              : !!size,
        [className]                  : className,
        touchScreen                  : IS_TOUCH_DEVICE,
        processing                   : isProcessing,
        [`${labelPlacement}Label`]   : labelPlacement,
        [variant]                    : variant,
        [`${pictureVariant}Picture`] : pictureVariant,
        withImage,
        disabled
    });
    const avatarWrapperCN = cx(styles.avatarWrapper, {
        touchScreen : IS_TOUCH_DEVICE
    });
    const isAvatarExist = avatarUrl || avatarPreview;
    const showLoader = isProcessing && withImage;

    return (
        <div className={avatarFormFieldCN}>
            { label
                ? (
                    <Typography variant='headline3' className={styles.title}>
                        {label}
                    </Typography>
                ) : null
            }

            <div
                className = {avatarWrapperCN}
                ref       = {node => avatarRef.current = node}
            >
                { avatarPreview
                    ? (
                        <Image
                            src               = {avatarPreview}
                            className         = {styles.avatarPreview}
                            // style             = {fallbackWrapperStyle}
                            FallbackComponent = {(
                                !isAvatarExist && !showLoader ? (
                                    <div className = {styles.fallbackAvatar}>
                                        A
                                    </div>
                                ) : void 0
                            )}
                        />
                    ) : null
                }

                { avatarUrl && !avatarPreview
                    ? (
                        <Image
                            src               = {avatarUrl}
                            size              = {IMAGE_SIZE}
                            className         = {styles.avatarPreview}
                            // style             = {fallbackWrapperStyle}
                            FallbackComponent = {(
                                <div className = {styles.fallbackAvatar}>
                                    <SvgIcon
                                        type      = {pictureVariant === 'secondary' ? 'photoSecondary' : 'user'}
                                        className = {styles.icon}
                                    />
                                </div>
                            )}
                            LoaderComponent = {(
                                <div className={styles.loaderWrapper}>
                                    <Loader size='XS' />
                                </div>
                            )}
                        />
                    ) : null
                }

                { !avatarPreview && !avatarUrl
                    ? (
                        <SvgIcon type={pictureVariant === 'secondary' ? 'photoSecondary' : 'user'} className={styles.icon} />
                    ) : null
                }

                <input
                    className   = {cx(styles.inputTypeFile)}
                    onChange    = {handleFilesSelect}
                    type        = 'file'
                    ref         = {node => uploadInputRef.current = node}
                    accept      = {accept ? accept : 'image/jpeg, image/jpg, image/png'}
                    multiple    = {false}
                />
                <button
                    className = {`${styles.loadButton} abort-submit`}
                    onClick   = {openMenu}
                    onFocus   = {openMenu}
                    type      = 'button'
                >
                    { isAvatarExist ? t('Edit') : t('Upload') }
                </button>
                <DropdownMenu
                    classes               = {{ itemLabel: styles.dropdownLabel, itemMenu: styles.menuItem }}
                    items                 = {getMenuOptions()}
                    menuStyles            = {menuStyles}
                    isOpened              = {isMenuOpen}
                    onChange              = {handleSelectMenuItem}
                    value                 = ''
                    closeMenu             = {useCallback(handleCloseMenu, [])}
                    tipMessage            = {tipMessage}
                />
                { showLoader
                    ? (
                        <div className={styles.loaderWrapper}>
                            <Loader size='XS' />
                        </div>
                    ) : null
                }
            </div>
        </div>
    );
}

AvatarFormField.propTypes = {
    label             : PropTypes.any,
    labelPlacement    : PropTypes.oneOf([ 'top', 'left' ]),
    size              : PropTypes.oneOf([ 'M', 'L', 'XL', 'XXL', '' ]),
    variant           : PropTypes.oneOf([ 'circle', 'square', '' ]),
    pictureVariant    : PropTypes.oneOf([ 'primary', 'secondary', '' ]),
    className         : PropTypes.string,
    value             : PropTypes.string,
    name              : PropTypes.string,
    isProcessing      : PropTypes.bool,
    disabled          : PropTypes.bool,
    addToast          : PropTypes.func.isRequired,
    onChange          : PropTypes.func.isRequired,
    availableFormats  : PropTypes.arrayOf(PropTypes.string),
    accept            : PropTypes.string,
    uploadOptionLabel : PropTypes.string,
    t                 : PropTypes.func,
    tipMessage        : void 0,
    extensionMessage  : PropTypes.string
};

AvatarFormField.defaultProps = {
    label             : '',
    labelPlacement    : 'left',
    variant           : 'circle',
    pictureVariant    : 'primary',
    size              : 'M',
    className         : '',
    value             : '',
    name              : '',
    isProcessing      : false,
    disabled          : false,
    availableFormats  : void 0,
    accept            : void 0,
    uploadOptionLabel : '',
    t                 : (text) => text,
    tipMessage        : void 0,
    extensionMessage  : ''
};

export default memo(AvatarFormField);
