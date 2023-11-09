import withCloseOnEsc                  from '../withCloseOnEsc';
import withAllowTabMoveOnlyInComponent from '../withAllowTabMoveOnlyInComponent';

import Base                            from './Base';


const componentWithHOCS = withAllowTabMoveOnlyInComponent(withCloseOnEsc(Base));


export default componentWithHOCS;
