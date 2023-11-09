import { compose }         from 'redux';
import { withTranslation } from 'react-i18next';

import SecondLevelModal    from './SecondLevelModal';

export default compose(withTranslation())(SecondLevelModal);
