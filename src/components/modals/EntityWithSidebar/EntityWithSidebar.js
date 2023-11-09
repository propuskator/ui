import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import FormControls             from 'templater-ui/src/components/shared/FormControls';

import CustomForm               from 'Shared/CustomForm';
import EntityList               from 'Shared/EntityList';


import styles                   from './EntityWithSidebar.less';

const cx = classnames.bind(styles);

class EntityWithSidebar extends PureComponent {
    static propTypes = {
        sidebar : PropTypes.shape({
            className : PropTypes.string,
            items     : PropTypes.arrayOf(PropTypes.shape({
                id             : PropTypes.string.isRequired,
                title          : PropTypes.string,
                emptyMessage   : PropTypes.string.isRequired,
                searchLabel    : PropTypes.string.isRequired,
                onAddEntity    : PropTypes.func.isRequired,
                onCreateEntity : PropTypes.func,
                isFetching     : PropTypes.bool,
                list           : PropTypes.arrayOf(PropTypes.shape({
                    id   : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]).isRequired,
                    name : PropTypes.string.isRequired
                }))
            }).isRequired).isRequired
        }).isRequired,
        initialState        : PropTypes.object,
        errors              : PropTypes.shape({}).isRequired,
        onSubmit            : PropTypes.func.isRequired,
        formatter           : PropTypes.func,
        onInteract          : PropTypes.func,
        isProcessing        : PropTypes.bool.isRequired,
        onCancell           : PropTypes.func.isRequired,
        title               : PropTypes.string.isRequired,
        contentClassName    : PropTypes.string,
        entityConfiguration : PropTypes.shape({
            name     : PropTypes.string.isRequired,
            title    : PropTypes.string,
            fields   : PropTypes.array.isRequired,
            controls : PropTypes.shape({
                cancell : PropTypes.shape({
                    title : PropTypes.string.isRequired
                }).isRequired,
                submit : PropTypes.shape({
                    title : PropTypes.string.isRequired
                }).isRequired
            })
        }).isRequired,
        formRef : PropTypes.shape({
            current : PropTypes.shape({})
        }).isRequired,
        controls : PropTypes.shape({
            cancell : PropTypes.shape({
                title : PropTypes.string.isRequired
            }),
            submit : PropTypes.shape({
                title : PropTypes.string.isRequired
            })
        }),
        level : PropTypes.oneOf([ 'first', 'second' ]),
        t     : PropTypes.func
    };

    static defaultProps = {
        formatter        : void 0,
        onInteract       : void 0,
        controls         : void 0,
        level            : 'first',
        initialState     : {},
        contentClassName : '',
        t                : (text) => text
    }

    state = {
        grabbingId : null,
        search     : ''
    }

    handleSearchClick = () => {
        this.setState({ search: true });
    }

    handleCancell = () => {
        const { onCancell } = this.props;

        onCancell();
    }

    handleSubmit = async () => {
        const { onSubmit, formRef } = this.props;
        const { current } = formRef || {};

        if (!current) return console.log('handleSubmit error: there is no form ref');

        if (this.isProcessing) return;
        this.isProcessing = true;
        try {
            await onSubmit(current.getValue());
        } catch (error) {
            console.error('handleSubmit() ', error);
            // pass
        } finally {
            this.isProcessing = false;
        }
    }

    handleSetGrabbingId = (grabbingId) => {
        this.setState({ grabbingId });
    }

    handleChangeSearch = ({ name, value }) => {
        this.setState({ [name]: value });
    }

    handleSearchDelete = () => {
        this.setState({ search: false, searchField: '' });
    }

    onSetGrabbingId = (grabbingId) => {
        this.setState({ grabbingId });
    }

    checkIsValid() {
        const { errors = {} } = this.props;

        return Object.values(errors || {}).every(valid => !valid);
    }

    render() {
        const {
            initialState,
            entityConfiguration,
            formRef,
            formatter,
            onSubmit,
            onInteract,
            isProcessing,
            errors,
            sidebar = {},
            controls,
            title,
            level,
            contentClassName,
            t
        } = this.props;

        const sidebarItems = sidebar?.items || [];
        const { grabbingId } = this.state;
        const isValid = this.checkIsValid();
        const entityWithSidebarCN = cx(styles.EntityWithSidebar, {
            processing        : isProcessing,
            [`${level}Level`] : level
        });

        return (
            <div className={entityWithSidebarCN}>
                <div className={styles.title}>
                    {title}
                </div>
                <div className={cx(styles.content, { [contentClassName]: contentClassName })}>
                    <div className={cx(styles.sidebarWrapper, { [sidebar.className]: sidebar.className })}>
                        { sidebarItems.map((sidebarData) => {
                            const {
                                id,
                                list = [],
                                title,  /* eslint-disable-line no-shadow */
                                emptyMessage,
                                onCreateEntity,
                                onAddEntity,
                                searchLabel
                            } = sidebarData || {};

                            return (
                                <EntityList
                                    {...sidebarData}
                                    t               = {t}
                                    key             = {id}
                                    className       = {sidebarData?.className}
                                    title           = {title}
                                    emptyMessage    = {emptyMessage}
                                    onAddEntity     = {onAddEntity}
                                    onCreateEntity  = {onCreateEntity}
                                    isProcessing    = {isProcessing}
                                    list            = {list}
                                    searchLabel     = {searchLabel}
                                    onSetGrabbingId = {this.handleSetGrabbingId}
                                />
                            );
                        }) }
                    </div>
                    <div
                        className={cx(styles.formWrapper, {
                            [entityConfiguration.className] : entityConfiguration.className
                        })}
                    >
                        <CustomForm
                            configuration = {{
                                ...entityConfiguration,
                                fields : entityConfiguration.fields.map(field => field.type === 'draggableList'
                                    ? (
                                        {
                                            ...field,
                                            props : {
                                                ...(field.props || {}),
                                                grabbingId,
                                                onDrop : this.onSetGrabbingId
                                            }
                                        }
                                    )
                                    : field)
                            }}
                            initialState  = {initialState}
                            isProcessing  = {isProcessing}
                            errors        = {errors}
                            onSubmit      = {onSubmit}
                            onCancell     = {this.props.onCancell}
                            onInteract    = {onInteract}
                            formatter     = {formatter}
                            forwardRef    = {formRef}
                        />
                    </div>
                </div>

                <FormControls
                    controls         = {controls}
                    isFormProcessing = {isProcessing}
                    isSubmitDisabled = {!isValid}
                    className        = {styles.formControls}
                    onCancell        = {this.handleCancell}
                    onSubmit         = {this.handleSubmit}
                />
            </div>
        );
    }
}

export default EntityWithSidebar;
