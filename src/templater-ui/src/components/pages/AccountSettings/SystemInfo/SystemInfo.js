import React, { useCallback }   from 'react';
import PropTypes                from 'prop-types';

import moment                   from 'moment';

import Typography               from '../../../base/Typography';
import SvgIcon                  from '../../../base/SvgIcon';
import Tooltip                  from '../../../base/Tooltip';

import styles    from './SystemInfo.less';


function SystemInfo(props) {
    const { updaterData, openModal, fetchChangelog, t } = props;

    const { version, updated_at } = updaterData || {};

    const handleChangelogClick = useCallback(() => {
        fetchChangelog({ isOnlyFetchData: true });
        openModal('changelog');
    }, [ openModal, updaterData ]);

    return (
        <div className={styles.SystemInfo}>
            <Typography variant='headline3' className={styles.title}>
                {t('System information')}
            </Typography>

            <Typography variant='headline4' className={styles.version} >
                v. {version}
            </Typography>

            <div className={styles.lastUpdatedRow}>
                <Typography variant='headline4' color='greyDark'>
                    {t('Last system update')} - &nbsp;
                </Typography>
                <div className={styles.dateWrapper}>
                    <Typography variant='headline4'>
                        {
                            moment(updated_at).isValid()
                                ? moment(updated_at).format('DD.MM.YYYY')
                                : '-'
                        }
                    </Typography>
                    <Tooltip
                        title     = {t('Release notes')}
                        className = {styles.iconTooltip}
                        classes   = {{ tooltip: styles.tooltip }}
                    >
                        <div className={styles.iconWrapper}>
                            <SvgIcon
                                className = {styles.changelogIcon}
                                type      = 'changelog'
                                color     = ''
                                onClick   = {handleChangelogClick}
                            />
                        </div>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
}

SystemInfo.propTypes = {
    updaterData : PropTypes.shape({
        version    : PropTypes.string,
        updated_at : PropTypes.string,
        changelogs : PropTypes.string
    }),
    openModal      : PropTypes.func,
    fetchChangelog : PropTypes.func,
    t              : PropTypes.func
};

SystemInfo.defaultProps = {
    updaterData    : {},
    openModal      : void 0,
    fetchChangelog : void 0,
    t              : (text) => text
};

export default SystemInfo;
