import { connect }                     from 'react-redux';

import {
    accessSubjectsListSelector
}                                      from 'Selectors/accessSubjects';
import {
    accessTokenReadersListSelector
}                                      from 'Selectors/accessTokenReaders';
import {
    accessReadersGroupsListSelector
}                                      from 'Selectors/accessReadersGroups';
import {
    accessSchedulesListSelector
}                                      from 'Selectors/accessSchedules';
import { accessSettingSelector }       from 'Selectors/accessSettings';
import { workspaceTimezoneSelector }   from 'Selectors/workspace';
import { fetchAccessSubjects }         from 'Actions/accessSubjects';
import { fetchAccessReadersGroups }    from 'Actions/accessReadersGroups';
import { fetchAccessTokenReaders }     from 'Actions/accessTokenReaders';
import { fetchAccessSchedules }        from 'Actions/accessSchedules';
import * as accessSettingsActions      from 'Actions/accessSettings';
import * as toastActions               from 'Actions/toasts';
import withCloseOnEsc                  from '../withCloseOnEsc';
import withAllowTabMoveOnlyInComponent from '../withAllowTabMoveOnlyInComponent';

import AccessSetting                   from './AccessSetting';


function mapStateToProps(state, ownProps) {
    const { entityId } = ownProps;

    return {
        accessSubjectsList      : accessSubjectsListSelector(state),
        accessReadersGroupsList : accessReadersGroupsListSelector(state),
        accessTokenReadersList  : accessTokenReadersListSelector(state),
        accessSchedulesList     : accessSchedulesListSelector(state),
        entityData              : accessSettingSelector(state, entityId) || {},
        timezone                : workspaceTimezoneSelector(state)
    };
}

const mapDispatchToProps = {
    fetchAccessSubjects,
    fetchAccessTokenReaders,
    fetchAccessSchedules,
    fetchAccessReadersGroups,
    ...toastActions,
    ...accessSettingsActions
};

const componentWithHOCS = withAllowTabMoveOnlyInComponent(withCloseOnEsc(AccessSetting));

export default connect(mapStateToProps, mapDispatchToProps)(componentWithHOCS);
