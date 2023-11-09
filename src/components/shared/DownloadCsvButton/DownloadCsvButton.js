import React, {
    useState
}                       from 'react';
import PropTypes        from 'prop-types';
import classNames       from 'classnames/bind';

import Button           from 'templater-ui/src/components/base/Button';
import Tooltip          from 'templater-ui/src/components/base/Tooltip';

import SvgIcon          from 'Base/SvgIcon';

import styles           from './DownloadCsvButton.less';

const cx = classNames.bind(styles);


function DownloadCsvButton({
    onClick,
    isProcessing,
    className,
    t
}) {
    const [ isLoading, setIsLoading ] = useState(isProcessing);

    async function handleClick() {
        if (isLoading) return;

        setIsLoading(true);
        try {
            await onClick();
        } catch (error) {
            // pass
        } finally {
            setIsLoading(false);
        }
    }

    const downloadCsvButtonCN = cx({
        DownloadCsvButton,
        [styles.Button] : true,
        disabled        : isLoading,
        [className]     : className,
        processing      : isLoading
    });

    return (
        <Tooltip title = {isLoading ? t('access-logs-page:File in progress') : t('access-logs-page:Download csv')}>
            <Button
                onClick   = {handleClick}
                isLoading = {isLoading}
                className = {downloadCsvButtonCN}
                size      = 'XS'
                variant   = 'outlined'
            >
                CSV <SvgIcon type='download' className={styles.downloadIcon} />
            </Button>
        </Tooltip>
    );
}

DownloadCsvButton.propTypes = {
    onClick      : PropTypes.func,
    isProcessing : PropTypes.bool,
    className    : PropTypes.string,
    t            : PropTypes.func.isRequired
};

DownloadCsvButton.defaultProps = {
    onClick      : null,
    isProcessing : false,
    className    : ''
};

export default DownloadCsvButton;

