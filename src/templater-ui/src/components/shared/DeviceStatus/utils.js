import { capitalizeString }     from '../../../utils/helpers/index.js';
import { getVersion }           from '../../../utils/products';


export function getDeviceStatusMeta({
    status,
    firmwareVersion,
    productVersion
    // , productStatus
}) {
    function getColorByStatus() {
        if ([ 'disconnected', 'lost', 'alert' ].includes(status)) return 'red';
        if ([ 'init', 'sleeping' ].includes(status)) return 'yellow';
        if ([ 'ready' ].includes(status)) return 'green';
    }
    const firmwareMajor = getVersion(firmwareVersion);
    const productMajor = getVersion(productVersion);

    let color = getColorByStatus(status) || 'red';
    let processStatus = status || 'Is not connected';

    // const isPublished = !(productVersion === '1.0' && productStatus === 'draft');

    const isWaiting = !isNaN(firmwareMajor)
        ? (productMajor !== firmwareMajor) || !status
        : false;

    if (isWaiting) {
        color = 'yellow';
        processStatus = 'waiting';
    }

    const COLORS_MAP = {
        red    : '#d86259',
        green  : '#029487',
        yellow : '#FFC88B'
    };

    return {
        color         : COLORS_MAP[color] || COLORS_MAP.red,
        processStatus : capitalizeString(processStatus)
    };
}
