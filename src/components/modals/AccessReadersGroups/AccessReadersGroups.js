/* eslint-disable  more/no-duplicated-chains, babel/no-unused-expressions,  */
import React, {
    useCallback,
    useRef,
    useState,
    useEffect
}                        from 'react';
import PropTypes         from 'prop-types';
import classnames        from 'classnames/bind';


import { useMedia }      from 'templater-ui/src/utils/mediaQuery';
import IconButton        from 'templater-ui/src/components/base/IconButton';
import Typography        from 'templater-ui/src/components/base/Typography';
import Chip              from 'templater-ui/src/components/base/Chip';

import EntityList        from 'Shared/EntityList';
import SecondLevelModal  from '../SecondLevelModal';

import styles            from './AccessReadersGroups.less';

const cx = classnames.bind(styles);

function AccessReadersGroups(props) {    /* eslint-disable-line max-lines-per-function */
    const {
        fetchList, list, clearList, deleteEntity, isFetching,
        name, isTopModal, onClose, closeModal,
        level, t
    } = props;

    const [ modalData, setModalData ] = useState(null);
    const [ searchData, setSearchData ] = useState({
        accessReadersGroups : ''
    });

    const componentRef  = useRef({});

    const searchRef = useRef({});
    const accessReadersGroupsCN = cx(styles.AccessReadersGroups, {
        topModal          : isTopModal,
        [`${level}Level`] : level
    });

    async function refreshList() {
        await fetchList({ limit: 30, sortedBy: 'name', order: 'ASC' });
    }

    useEffect(() => {
        refreshList();

        return () => {
            clearList();
            if (onClose) onClose(componentRef?.current?.onCloseParams);
        };
    }, [ ]);

    const isMobile = useMedia(
        // Media queries
        [ '(max-width: 612px)', '(min-width: 613px)' ],
        // values by media index
        [ true, false ],
        // Default
        false
    );

    function calcModalPosition() {
        if (isMobile) {
            return ({
                position : 'absolute',
                top      : modalData?.styles?.top
            });
        }

        return ({
            position : 'absolute',
            top      : modalData?.styles?.top
        });
    }

    function openSecondLevelModal(e, { name, props, modalParams = {} } = {}) {    /* eslint-disable-line no-shadow */
        const nodeData = e?.target?.getBoundingClientRect() || null;

        const modalStyles = nodeData
            ? ({ // eslint-disable-next-line no-magic-numbers
                top  : `${ nodeData?.y - 60 }px`, // 60 - distance from the clicked button to the top border of the first level modal
                left : nodeData?.x
            }) : null;

        setModalData({
            name,
            props,
            ...modalParams,
            styles : modalStyles
        });
    }

    function closeSecondLevelModal() {
        setModalData(void 0);
    }

    function handleChangeSearch({ name, value }) {  // eslint-disable-line no-shadow
        setSearchData((prevData) => ({
            ...prevData,
            [name] : value
        }));
    }

    function handleOpenCreateReadersGroup(e) {
        openSecondLevelModal(e, {
            name        : 'accessReadersGroup',
            modalParams : {
                width  : 305,
                height : 523
            },
            props : {
                isCreateEntity : true,
                onClose        : async ({ entity } = {}) => {
                    if (entity) await refreshList();
                    searchRef?.current?.focus();
                },
                onCancell : () => closeSecondLevelModal()
            }
        });
    }

    function handleDeleteReadersGroup(e, readersGroup) {
        openSecondLevelModal(e, {
            name  : 'confirm',
            props : {
                title        : t('readers-groups-page:Delete space'),
                message      : t('readers-groups-page:The space will be deleted. You cannot undo this action via web application.'),
                cancelLabel  : t('Cancel'),
                confirmLabel : t('Delete'),
                onClose      : () => {
                    searchRef?.current?.focus();
                },
                onSubmit : async () => {
                    try {
                        await deleteEntity({ id: readersGroup?.id });
                        await refreshList();
                        closeSecondLevelModal();
                    } catch (error) {
                        console.error(error);
                    }
                },
                onCancell : () => closeSecondLevelModal()
            }
        });
    }

    function handleEditReadersGroup(e, readersGroup) {
        openSecondLevelModal(e, {
            name  : 'accessReadersGroup',
            props : {
                entityId  : readersGroup?.id,
                onSuccess : () => {
                    componentRef.current.onCloseParams = {
                        isUpdated : true
                    };
                    closeSecondLevelModal();
                },
                onCancell : () => closeSecondLevelModal(),
                onClose   : async () => {
                    searchRef?.current?.focus();
                    await refreshList();
                }
            }
        });
    }

    function renderReadersGroup(readersGroup) {
        return (
            <div className={styles.readersGroupWrapper} key={readersGroup?.id}>
                <div className={styles.chipWrapper}>
                    <Chip
                        className  = {styles.chip}
                        background = {readersGroup?.color}
                    >
                        { readersGroup?.name }
                    </Chip>
                </div>
                <div className={styles.controls}>
                    <IconButton
                        iconType  = 'edit'
                        /* eslint-disable-next-line react/jsx-no-bind */
                        onClick   = {(e) => handleEditReadersGroup(e, readersGroup)}
                    />
                    <IconButton
                        iconType  = 'bin'
                        /* eslint-disable-next-line react/jsx-no-bind */
                        onClick   = {(e) => handleDeleteReadersGroup(e, readersGroup)}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={accessReadersGroupsCN} key={name}>
            <IconButton
                iconType  = 'cross'
                className = {styles.closeButton}
                onClick   = {useCallback(() => closeModal(name), [])}
            />
            <div className={styles.content}>
                <Typography
                    className = {styles.title}
                    variant   = 'headline3'
                    color     = 'primary500'
                >
                    {t('readers-groups-page:Spaces management')}
                </Typography>
                <div className={styles.entityListWrapper}>
                    <EntityList
                        name           = 'accessReadersGroups'
                        emptyMessage   = {`${t('readers-groups-page:No spaces to display')}. ${t('readers-groups-page:You can create a new space')}`}
                        searchLabel    = {t('readers-groups-page:Find by space')}
                        grabbing       = {false}
                        expanded       = {false}
                        onCreateEntity = {useCallback(handleOpenCreateReadersGroup)}
                        renderItem     = {useCallback(renderReadersGroup)}
                        isFetching     = {isFetching}
                        list           = {list}
                        searchRef      = {searchRef}
                        autoFocus
                        search         = {searchData?.accessReadersGroups}
                        updateSearch   = {handleChangeSearch}
                        t              = {t}
                    />
                </div>
            </div>
            <SecondLevelModal
                modalData  = {modalData}
                closeModal = {closeSecondLevelModal}
                calcModalPosition = {calcModalPosition}
            />
        </div>
    );
}

AccessReadersGroups.propTypes = {
    name         : PropTypes.string.isRequired,
    isTopModal   : PropTypes.bool.isRequired,
    fetchList    : PropTypes.func.isRequired,
    clearList    : PropTypes.func.isRequired,
    deleteEntity : PropTypes.func.isRequired,
    closeModal   : PropTypes.func.isRequired,
    level        : PropTypes.oneOf([ 'first', 'second' ]),
    list         : PropTypes.arrayOf(PropTypes.shape({
        id   : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]).isRequired,
        name : PropTypes.string.isRequired
    })),
    isFetching : PropTypes.bool.isRequired,
    onClose    : PropTypes.func.isRequired,
    t          : PropTypes.func.isRequired
};

AccessReadersGroups.defaultProps = {
    level : 'first',
    list  : []
};

export default React.memo(AccessReadersGroups);
