
import React, {
    useState,
    useEffect,
    useRef
}                               from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import Typography               from 'templater-ui/src/components/base/Typography';
import InputCopyText            from 'templater-ui/src/components/base/Input/InputCopyText';
import CopyTextButton           from 'templater-ui/src/components/base/CopyTextButton';
import Loader                   from 'templater-ui/src/components/base/Loader';
import Link                     from 'templater-ui/src/components/base/Link';

import SvgIcon                  from 'Base/SvgIcon';

import { TOASTS_KEYS }          from 'Constants/toasts';

import pageStyles               from '../styles.less';
import styles                   from './APISettings.less';

const cx = classnames.bind(styles);

function APISettings(props) {   // eslint-disable-line max-lines-per-function
    const {
        addToast,
        fetchApiSettings,
        refreshApiSettings,
        isFetching,
        dataAPI,
        login,
        openModal,
        closeModal,
        t
    } = props;
    const { qrCode = '', deepLinkUrl = '' } = dataAPI?.requestSubjectRegistration || {};
    const [ isProcessing, setIsProcessing ] = useState(false);
    const componentRef                      = useRef({});

    useEffect(() => {
        fetchApiSettings();
    }, []);

    async function handleSubmit(e) {
        if (e) e.preventDefault();
        if (e) e.stopPropagation();

        if (componentRef.current.isProcessing) return;
        componentRef.current.isProcessing = true;   // eslint-disable-line more/no-duplicated-chains
        setIsProcessing(true);
        try {
            await refreshApiSettings();

            // addToast({
            //     key     : TOASTS_KEYS.apiSettingsUpdate,
            //     title   : t('Action was completed successfully'),
            //     message : t('api-settings-page:Access token has been updated'),
            //     type    : 'success'
            // });
        } catch (error) {
            addToast({
                key     : TOASTS_KEYS.apiSettingsUpdate,
                title   : t('Something went wrong'),
                message : t('api-settings-page:Access token hasn\'t been updated'),
                type    : 'error'
            });
        } finally {
            setIsProcessing(false);
            componentRef.current.isProcessing = false;   // eslint-disable-line more/no-duplicated-chains, require-atomic-updates, max-len
        }
    }

    function submitWithConfirm(e) {
        if (e) e.preventDefault();
        if (e) e.stopPropagation();

        openModal('confirm', {
            size         : 'L',
            scrollType   : 'paper',
            title        : t('api-settings-page:Update access token'),
            message      : t('api-settings-page:The access token will be updated. You cannot undo this action. Access points added earlier with the current token will stop working.'),
            cancelLabel  : t('api-settings-page:Cancel'),
            confirmLabel : t('Update'),
            onSubmit     : async () => {
                await handleSubmit();
                closeModal('confirm');
            },
            onCancell : () => closeModal('confirm')
        });
    }

    function handleDownloadQrCode() {
        if (!qrCode) return;
        try {
            const a = document.createElement('a');

            a.setAttribute('href', `${qrCode}`);
            a.download = 'QRcode.png';
            a.click();
        } catch (error) {
            console.error({ error });

            addToast({
                key     : TOASTS_KEYS.apiSettingsQrCodeDownload,
                title   : t('Something went wrong'),
                message : t('api-settings-page:QR code hasn\'t been downloaded'),
                type    : 'error'
            });
        }
    }

    // const isInitialFetching = true;
    const isInitialFetching = isFetching && !dataAPI?.url &&  !dataAPI?.token;

    const APISettingsCN = cx(styles.APISettings, {
        blurred : isInitialFetching
    });

    return (
        <div className={APISettingsCN}>
            <div className={pageStyles.pageContent}>
                <Typography
                    variant   = 'headline2'
                    color     = 'primary900'
                    className = {cx(pageStyles.pageTitle, styles.pageTitle)}
                >
                    {t('api-settings-page:API Settings')}
                </Typography>
                <div className={styles.content}>
                    <form className={styles.formWrapper}>
                        <div className={styles.infoBlock}>
                            <Typography
                                variant = {'headline4'}
                                className={styles.subtitle}
                            >
                                {t('Login')}
                            </Typography>
                            <InputCopyText
                                className = {styles.value}
                                value     = {login || '-'}
                                isLoading = {isInitialFetching}
                                variant   = 'simple'
                                t         = {t}
                            />
                        </div>

                        <div className={cx(styles.infoBlock, { tokenField: true })}>
                            <Typography
                                variant = {'headline4'}
                                className={styles.subtitle}
                            >
                                {t('api-settings-page:Access token')}
                            </Typography>
                            <InputCopyText
                                className = {styles.value}
                                value     = {dataAPI?.token || '-'}
                                isLoading = {isInitialFetching}
                                variant   = 'simple'
                                t         = {t}
                            />
                            <Link
                                className = {styles.controlLink}
                                onClick   = {submitWithConfirm}
                                isHidden  = {isProcessing}
                                color     = 'primary'
                            >
                                {t('api-settings-page:Update token')}
                            </Link>
                        </div>

                        <div className={styles.infoBlock}>
                            <Typography
                                variant = {'headline4'}
                                className={cx(styles.subtitle, { cert: true })}
                            >
                                {t('api-settings-page:Certificate')}
                                <CopyTextButton
                                    text      = {dataAPI?.cert || '-'}
                                    className = {styles.copyTextButton}
                                    t         = {t}
                                    variant   = 'simple'
                                    color     = {'primary500'}
                                />
                            </Typography>
                            <InputCopyText
                                className = {styles.value}
                                value     = {dataAPI?.cert || '-'}
                                isLoading = {isInitialFetching}
                                rowsMax   = {6}
                                t         = {t}
                            />
                        </div>

                        <div className={styles.infoBlock}>
                            <Typography
                                variant = {'headline4'}
                                className={styles.subtitle}
                            >
                                {t('api-settings-page:Server URL')}
                            </Typography>

                            <InputCopyText
                                className = {styles.value}
                                value     = {dataAPI?.url || '-'}
                                isLoading = {isInitialFetching}
                                t         = {t}
                                variant   = 'simple'
                            />
                        </div>

                        <div className={styles.infoBlock}>
                            <Typography
                                variant = {'headline4'}
                                className={styles.subtitle}
                            >
                                {t('api-settings-page:Broker port')}
                            </Typography>

                            <InputCopyText
                                className = {styles.value}
                                value     = {dataAPI?.emqxTcpPort}
                                isLoading = {isInitialFetching}
                                variant   = 'simple'
                                t         = {t}
                            />
                        </div>
                    </form>
                    <div className={styles.registrationLinksBlock}>
                        <div className={styles.deepLink}>
                            <Typography
                                variant   = {'headline4'}
                                className = {styles.subtitle}
                            >
                                {t('api-settings-page:Deep link for subject registration')}
                            </Typography>
                            <InputCopyText
                                className = {styles.value}
                                value     = {deepLinkUrl || '-'}
                                isLoading = {isInitialFetching}
                                variant   = 'simple'
                                t         = {t}
                            />
                        </div>
                        <div className={styles.qrCode}>
                            <Typography
                                variant   = {'headline4'}
                                className = {styles.subtitle}
                            >
                                {t('api-settings-page:QR code for subject registration')}
                            </Typography>
                            <div className={styles.qrCodeWrapper}>
                                <img src={qrCode} alt={t('api-settings-page:QR code')} />
                            </div>
                            <SvgIcon
                                type = 'download'
                                size = '30px'
                                onClick = {handleDownloadQrCode}
                                className = {cx(styles.downloadIcon, { disabled: !qrCode })}
                            />
                        </div>
                    </div>
                </div>
                { isInitialFetching
                    ? (
                        <div className={styles.loaderWrapper}>
                            <Loader size = 'S' />
                        </div>
                    )
                    : null
                }
            </div>
        </div>
    );
}

APISettings.propTypes = {
    fetchApiSettings   : PropTypes.func.isRequired,
    addToast           : PropTypes.func.isRequired,
    refreshApiSettings : PropTypes.func.isRequired,
    openModal          : PropTypes.func.isRequired,
    closeModal         : PropTypes.func.isRequired,
    isFetching         : PropTypes.bool,
    dataAPI            : PropTypes.shape({
        url   : PropTypes.string,
        token : PropTypes.string,
        cert  : PropTypes.string
    }),
    login : PropTypes.string,
    t     : PropTypes.func
};

APISettings.defaultProps = {
    isFetching : false,
    dataAPI    : null,
    login      : '',
    t          : (text) => text
};

export default APISettings;
