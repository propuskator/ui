import React, {
    useEffect,
    useState
}                               from 'react';
import { v4 as uuidv4 }         from 'uuid';
import {
    MuiPickersUtilsProvider
}                               from '@material-ui/pickers';
import DateFnsUtils             from '@date-io/date-fns';
import format                   from 'date-fns/format';
import ruLocale                 from 'date-fns/locale/ru';
import uaLocale                 from 'date-fns/locale/uk';

import globalEscHandler         from './../../../utils/eventHandlers/globalEscHandler';

import DateRangePicker          from './DateRangePicker';


class LocalizedUtils extends DateFnsUtils {
    getDatePickerHeaderText(date) {
        return format(date, 'cccccc, d MMMM', { locale: this.locale });
    }

    getCalendarHeaderText(date) {
        return format(date, 'LLLL yyyy', { locale: this.locale });
    }
}

function withCloseOnEsc(Component) {
    return function ConnectedComponent(props = {}) {
        const [ calendarKey, setCalendarKey ] = useState('calendar');
        const { onClose, open } = props; // eslint-disable-line react/prop-types

        useEffect(() => {
            // eslint-disable-next-line
            if (!open) setCalendarKey(uuidv4());   // bad fix for refresh picker
        }, [ open ]);

        useEffect(() => {
            function closeModalOnExit() {
                if (open && onClose) onClose();
            }

            if (open) {
                globalEscHandler.register(closeModalOnExit);
            } else globalEscHandler.unregister(closeModalOnExit);

            return () => {
                globalEscHandler.unregister(closeModalOnExit);
            };
        }, [ open ]);

        return <Component key={calendarKey} {...props} />;
    };
}

const LOCALES_UTILS_BY_LANG = {
    ru : ruLocale,
    uk : uaLocale
};

function Datepicker(props) {
    const { languageId = '' } = props;  // eslint-disable-line react/prop-types

    return (
        <MuiPickersUtilsProvider
            utils  = {LocalizedUtils}
            locale ={LOCALES_UTILS_BY_LANG[languageId]}
        >
            <DateRangePicker {...props} />
        </MuiPickersUtilsProvider>
    );
}

export default withCloseOnEsc(Datepicker);
