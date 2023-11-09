import { connect }                     from 'react-redux';

import withCloseOnEsc                  from '../withCloseOnEsc';
import withAllowTabMoveOnlyInComponent from '../withAllowTabMoveOnlyInComponent';

import Changelog                       from './Changelog';

function mapStateToProps(state) {
    return {
        updaterData : state?.updater
    };
}

const componentWithHOCS = withAllowTabMoveOnlyInComponent(withCloseOnEsc(Changelog));

export default connect(mapStateToProps, null)(componentWithHOCS);
