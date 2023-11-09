import { connect }                     from 'react-redux';

import {
    accessScheduleSelector
}                                      from 'Selectors/accessSchedules';
import * as accessSchedulesActions     from 'Actions/accessSchedules';
import * as toastActions               from 'Actions/toasts';
import withCloseOnEsc                  from '../withCloseOnEsc';
import withAllowTabMoveOnlyInComponent from '../withAllowTabMoveOnlyInComponent';

import AccessSchedule                  from './AccessSchedule';


function mapStateToProps(state, ownProps) {
    const { entityId } = ownProps;

    return {
        entityData : accessScheduleSelector(state, entityId) || {}
    };
}

const mapDispatchToProps = {
    ...toastActions,
    ...accessSchedulesActions
};

const componentWithHOCS = withAllowTabMoveOnlyInComponent(withCloseOnEsc(AccessSchedule));

export default connect(mapStateToProps, mapDispatchToProps)(componentWithHOCS);
