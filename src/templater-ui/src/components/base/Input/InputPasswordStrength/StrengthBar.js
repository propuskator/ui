import React, {
    useState,
    useEffect
}                    from 'react';
import PropTypes     from 'prop-types';
import classnames    from 'classnames/bind';
import zxcvbn        from 'zxcvbn';

import Tooltip       from '../../Tooltip';

import styles        from './StrengthBar.less';

const cx = classnames.bind(styles);

const INITIAL_SCORE = -1;

function StrengthBar(props) {
    const { className, userInputs, strengthLevels, value, t } = props;

    const [ score, setScore ] = useState(INITIAL_SCORE);

    useEffect(() => {
        // do some validation here! if validation didn't pass then don`t call zxcvbn
        if (`${value}`.length) {
            setScore(zxcvbn(value, userInputs).score);
        } else {
            setScore(INITIAL_SCORE);
        }
    }, [ value, userInputs ]);

    const level = strengthLevels[score];

    const strengthBarCN = cx(styles.StrengthBar, {
        [className] : className
    });

    return (
        <div className={strengthBarCN}>
            { level
                ? (
                    <Tooltip
                        placement = 'bottom'
                        classes   = {{ tooltip: styles.tooltip }}
                        title     = {
                            <span className={styles.tooltipText} style={{ color: level.color }}>
                                {t(level.label)}
                            </span>
                        }
                    >
                        <div className={styles.container}>
                            <div className={styles.barWrapper}>
                                <div
                                    className = {styles.barLevel}
                                    style     = {{ width: level.width, background: level.color }}
                                />
                            </div>
                        </div>
                    </Tooltip>
                ) : null
            }
        </div>
    );
}


StrengthBar.propTypes = {
    className      : PropTypes.string,
    value          : PropTypes.string,
    userInputs     : PropTypes.array,
    strengthLevels : PropTypes.arrayOf(PropTypes.shape({
        label : PropTypes.string,
        color : PropTypes.string,
        width : PropTypes.string
    })),
    t : PropTypes.func.isRequired
};

StrengthBar.defaultProps = {
    className      : '',
    userInputs     : [],
    value          : '',
    strengthLevels : [
        { label: 'Weak', color: '#F15045', width: '15%' },
        { label: 'Weak', color: '#F15045', width: '35%' },
        { label: 'Fair', color: '#F1AC45', width: '55%' },
        { label: 'Fair', color: '#F1AC45', width: '75%' },
        { label: 'Strong', color: '#5CCD75', width: '100%' }
    ]
};

export default StrengthBar;
