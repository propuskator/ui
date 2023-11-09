import withCloseOnEsc                  from '../withCloseOnEsc';
import withAllowTabMoveOnlyInComponent from '../withAllowTabMoveOnlyInComponent';
import Confirm                         from './Confirm';

const componentWithHOCS = withAllowTabMoveOnlyInComponent(withCloseOnEsc(Confirm));

export default componentWithHOCS;
