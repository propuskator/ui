import withCloseOnEsc                  from '../withCloseOnEsc';
import withAllowTabMoveOnlyInComponent from '../withAllowTabMoveOnlyInComponent';

import CameraStream                    from './CameraStream';


const componentWithHOCS = withAllowTabMoveOnlyInComponent(withCloseOnEsc(CameraStream));

export default componentWithHOCS;
