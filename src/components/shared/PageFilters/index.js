import { connect }                from 'react-redux';
import { compose }                from 'redux';
import { withTranslation }        from 'react-i18next';

import PageFilters                from 'templater-ui/src/components/shared/PageFilters';

import DateRangePickerFilter      from './DateRangePickerFilter';

const CUSTOM_FIELDS_MAP = {
    dateRange : DateRangePickerFilter
};

function mapStateToProps(state, ownProps) {
    const { i18n } = ownProps;
    const languageId = i18n?.language;

    return {
        languageId,
        fieldsMap : CUSTOM_FIELDS_MAP
    };
}

export default compose(
    withTranslation(),
    connect(mapStateToProps, null)
)(PageFilters);
