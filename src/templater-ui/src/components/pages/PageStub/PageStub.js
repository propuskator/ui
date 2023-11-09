import React      from 'react';
import PropTypes  from 'prop-types';

import EmptyList  from '../../shared/EmptyList';
import Loader     from '../../base/Loader';

import styles     from './PageStub.less';

function PageStub(props) {
    const { children, isInitialized, total, emptyMessage } = props;

    if (isInitialized && total) return children;

    return (
        <div className={styles.PageStub}>
            { !total && isInitialized
                ? (
                    <div className = {styles.emptyListWrapper}>
                        <EmptyList iconType='emptyList'>
                            <div>
                                {emptyMessage}
                            </div>
                        </EmptyList>
                    </div>
                ) : null
            }

            { !isInitialized
                ? (
                    <div className={styles.loaderWrapper}>
                        <Loader size = 'S' />
                    </div>
                ) : null
            }
        </div>
    );
}

PageStub.propTypes = {
    children      : PropTypes.node.isRequired,
    isInitialized : PropTypes.bool.isRequired,
    total         : PropTypes.number.isRequired,
    emptyMessage  : PropTypes.any.isRequired
};

export default PageStub;
