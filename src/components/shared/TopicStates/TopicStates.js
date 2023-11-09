import React, {
    memo
}                       from 'react';
import PropTypes        from 'prop-types';
import classnames       from 'classnames/bind';

import Typography       from 'templater-ui/src/components/base/Typography';

import SvgIcon          from 'Base/SvgIcon';

import styles           from './TopicStates.less';

const cx = classnames.bind(styles);

function TopicStates(props) {
    const { className, topics } = props;

    const topicStatesCN = cx(styles.TopicStates, [ className ]);


    function renderTopic(topic, index) {
        const topicValue = topic?.value === 'true';
        const withDivider = topics.length > 1 && index !== topics.length - 1;

        return (
            <>
                <div className={styles.topicWrapper} key={topic?.name}>
                    <SvgIcon
                        className = {styles.statusIcon}
                        type      = {topicValue ? 'lockOpened' : 'lock'}
                        color     = {topicValue ? 'red' : 'green'}
                    />
                    <Typography
                        className = {styles.topicName}
                        variant   = 'body2'
                    >
                        {topic?.name}
                    </Typography>
                </div>

                {
                    withDivider
                        ? <div className={styles.divider}  />
                        : null
                }
            </>
        );
    }

    return (
        <>
            {
                topics.length
                 ? (
                     <div className={topicStatesCN}>
                         {
                            topics.map(renderTopic)
                        }
                     </div>)
                : null
            }
        </>
    );
}

TopicStates.propTypes = {
    className : PropTypes.string,
    topics    : PropTypes.array
};

TopicStates.defaultProps = {
    className : '',
    topics    : []
};

export default memo(TopicStates);
