import withCloseOnEsc                   from '../withCloseOnEsc';
import withAllowTabMoveOnlyInComponent  from '../withAllowTabMoveOnlyInComponent';

import AccessLogMedia                   from './AccessLogMedia';

export default withAllowTabMoveOnlyInComponent(withCloseOnEsc(AccessLogMedia));
