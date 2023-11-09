/* eslint-disable  no-throw-literal */
import React, {
    useCallback,
    useMemo,
    useEffect,
    useState,
    useRef
}                               from 'react';
import PropTypes                from 'prop-types';
import ReactMarkdown            from 'react-markdown/with-html';
import classnames               from 'classnames/bind';

import * as localStorageUtils   from '../../../utils/helpers/localStorage';
import { UPDATE_INFO }          from '../../../constants/localStorage';

import Base                     from '../Base';
import Loader                   from '../../base/Loader';
import CheckboxSquared          from '../../base/Checkbox/CheckboxSquared';
import Image                    from '../../base/Image';

import styles                   from './Changelog.less';

const MODAL_ID = 'changelogModal';

const cx = classnames.bind(styles);

// eslint-disable-next-line max-lines-per-function
function Changelog(props) {
    const {
        onClose, name, updaterData, closeModal, t
    } = props;

    const {
        changelogs, updated_at, isFetching
    } = updaterData;

    const contentRef = useRef();
    const [ withScrollGradient, setWithScrollGradient ] = useState(true);
    const [ isNotify, setIsNotify ] = useState(() => localStorageUtils.getData(UPDATE_INFO)?.allowNotify);

    useEffect(() => {
        const observer = new IntersectionObserver(handleIntersection, {
            threshold : 1
        });

        observer.observe(contentRef?.current);

        return () => {
            observer.unobserve(contentRef?.current);
            if (onClose) onClose();
        };
    }, []);

    const handleCloseModal = useCallback(() => closeModal(name), [ closeModal, name ]);

    const handleChangeCheckbox = useCallback(({ value }) => {
        localStorageUtils.saveData(UPDATE_INFO, {
            updated_at,
            allowNotify : value
        });
        setIsNotify(value);
    }, [ setIsNotify ]);

    const customComponents = {
        // eslint-disable-next-line react/prop-types
        'image' : ({ src, alt }) => (<Image
            className = {styles.image}
            src       = {src}
            alt       = {alt}
        />)
    };

    function handleIntersection([ entry ]) {
        setWithScrollGradient(!entry.isIntersecting);
    }

    const changelogCN = cx(styles.Changelog, {
        scrollGradient : withScrollGradient
    });

    const changelogsKeys = useMemo(() => Object.keys(changelogs || {}), [ changelogs ]);

    return (
        <Base
            id           = {MODAL_ID}
            title        = {t('Changelog')}
            name         = 'changelog'
            className    = {changelogCN}
            classes      = {{ content: styles.content, form: styles.form, fieldSet: styles.fieldSet }}
            initialState = {useMemo(() => ({ isNotify }), [])}
            onCloseModal = {handleCloseModal}
            configuration = {useMemo(() => ({
                name   : 'changelog',
                fields : [
                    {
                        name              : 'changelogs',
                        type              : 'customField',
                        renderCustomField : () => (
                            <div className = {styles.changelogContent}>
                                <div className = {styles.updates}>
                                    { isFetching
                                        ? <Loader />
                                        : null
                                    }
                                    { !changelogsKeys.length && !isFetching
                                        ? (
                                            <div className={styles.emptyList}>
                                                {t('There are no latest changelogs yet')}…<br />
                                                {t('You will get them with next release')}
                                            </div>
                                        ) : null
                                    }
                                    { changelogsKeys.length && !isFetching
                                        ? (
                                            changelogsKeys.map(key =>
                                                (<div className={styles.update} key={key}>
                                                    <ReactMarkdown
                                                        source    = {changelogs[key]}
                                                        renderers = {customComponents}
                                                    />
                                                </div>))
                                        ) : null
                                    }
                                    <div
                                        className = {styles.endTrigger}
                                        ref       = {contentRef}
                                    />
                                </div>
                            </div>
                        )
                    },
                    {
                        name              : 'allowNotify',
                        type              : 'customField',
                        renderCustomField : () => (
                            <CheckboxSquared
                                value     = {isNotify}
                                label     = {t('Notify about updates')}
                                onChange  = {handleChangeCheckbox}
                                className = {styles.checkboxWrapper}
                            />
                        )
                    }
                ]
            }), [ isNotify, updaterData, handleChangeCheckbox ])}
        />
    );
}

Changelog.propTypes = {
    onClose     : PropTypes.func,
    closeModal  : PropTypes.func,
    name        : PropTypes.string.isRequired,
    updaterData : PropTypes.shape({
        updated_at : PropTypes.string,
        changelogs : PropTypes.string
    }),
    t : PropTypes.func
};

Changelog.defaultProps = {
    updaterData : {},
    closeModal  : void 0,
    onClose     : void 0,
    t           : text => text
};

export default Changelog;
