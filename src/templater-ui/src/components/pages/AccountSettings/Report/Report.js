import React, { useCallback }   from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import Typography               from '../../../base/Typography';
import Button                   from '../../../base/Button';

import { TOASTS_KEYS }          from '../../../../constants/toasts';

import styles                   from './Report.less';

const cx = classnames.bind(styles);

function Report(props) {
    const {
        openModal, addToast, sendReport, t, subtitle,
        controlAlignment
    } = props;

    const handleClickReportBtn = useCallback(() => openModal('field', {
        title      : t('Send report'),
        subtitle   : subtitle ? subtitle : t('Tell us about your suggestions or comments for the application work'),
        fieldName  : 'message',
        entityData : {
            message : ''
        },
        customControls : {
            submit : {
                title : t('Send')
            }
        },
        onChange : async ({ message } = {}) => {
            try {
                await sendReport({
                    message,
                    onSuccess : () => {
                        // addToast({
                        //     key     : TOASTS_KEYS.acoountSettingsUpdate,
                        //     title   : t('Action was completed successfully'),
                        //     message : t('Report has been sent'),
                        //     type    : 'success'
                        // });
                    }
                });
            } catch (error) {
                if (error?.type !== 'validation') {
                    addToast({
                        key     : TOASTS_KEYS.acoountSettingsUpdate,
                        title   : t('Action was not completed successfully'),
                        message : t('Report hasn\'t been sent'),
                        type    : 'error'
                    });
                } else {
                    throw error;
                }
            }
        }
    }), [ openModal, sendReport, addToast, subtitle ]);

    const reportCN = cx(styles.Report, {
        [`controlsTo${controlAlignment}`] : controlAlignment
    });

    return (
        <div className={reportCN}>
            <Typography variant='headline3'>
                {t('Having problems?')}
            </Typography>

            <Typography
                variant   = 'body1'
                color     = 'greyDark'
                className = {styles.text}
            >
                {t('If you have any suggestions or comments for the application work - send us a report')}
            </Typography>

            <Button
                size      = 'L'
                color     = 'actionButton'
                className = {styles.submitButton}
                onClick   = {handleClickReportBtn}
            >
                {t('Send report')}
            </Button>
        </div>
    );
}

Report.propTypes = {
    openModal        : PropTypes.func,
    addToast         : PropTypes.func,
    sendReport       : PropTypes.func,
    t                : PropTypes.func,
    subtitle         : PropTypes.string,
    controlAlignment : PropTypes.string
};

Report.defaultProps = {
    subtitle         : void 0,
    openModal        : void 0,
    addToast         : void 0,
    sendReport       : void 0,
    t                : (text) => text,
    controlAlignment : 'left'
};

export default Report;
