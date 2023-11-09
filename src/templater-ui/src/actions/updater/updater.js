
import * as localStorageUtils from '../../utils/helpers/localStorage';
import { UPDATE_INFO }        from '../../constants/localStorage';
import {
    isFirstLoginSelector
}                             from '../../selectors/sessions';
import {
    FETCH_CHANGELOG_ERROR,
    FETCH_CHANGELOG_REQUEST,
    FETCH_CHANGELOG_SUCCESS
}                             from './../../constants/actions/updater';
import ActionsBase            from './../base';

export default class UpdaterService extends ActionsBase {
    constructor(...args) {
        super(...args);

        this.fetchChangelog  = this.fetchChangelog.bind(this);
        this.openModal       = void 0;
    }

    fetchChangelog({ isOnlyFetchData = false } = {}) {
        return async (dispatch, getState) => {
            dispatch({ type: FETCH_CHANGELOG_REQUEST });

            try {
                const state = getState();
                const isFirstLogin = isFirstLoginSelector(state);

                const response = await this.api.updateService.getChangelog();

                dispatch({
                    type    : FETCH_CHANGELOG_SUCCESS,
                    payload : {
                        version    : response?.version,
                        updated_at : response?.updated_at,
                        changelogs : response?.changelogs
                    }
                });

                if (this.openModal && !isOnlyFetchData && !isFirstLogin) {
                    const { updated_at, allowNotify } = localStorageUtils.getData(UPDATE_INFO) || {};

                    const isUpdateInfoWrong = allowNotify === undefined || !updated_at;
                    const isShowUserModal = isUpdateInfoWrong || (response?.updated_at > updated_at && allowNotify);

                    if (isShowUserModal) {
                        const updaterData = {
                            updated_at  : response?.updated_at,
                            allowNotify : true
                        };

                        localStorageUtils.saveData(UPDATE_INFO, updaterData);

                        dispatch(this.openModal('changelog'));
                    }
                }
            } catch (error) {
                dispatch({ type: FETCH_CHANGELOG_ERROR });
            }
        };
    }
}
