import withCloseOnEsc                  from '../withCloseOnEsc';
import withAllowTabMoveOnlyInComponent from '../withAllowTabMoveOnlyInComponent';

import Field from './Field';

export default withAllowTabMoveOnlyInComponent(withCloseOnEsc(Field));
