export function getPairInstructions() {
    return `1. Connect the device to power
2. Make sure the device is in the pairing mode
3. Click the Start pairing button and follow the further instructions
Note: if the device was previously connected, reset it to default settings according to the instructions`;
}

export function getVersion(version /* , versionType = 'major' */) {
    return parseInt(version, 10);
    // const versions = [ 'major', 'minor', 'patch' ];
    // const ver = `${version}` || '';

    // console.log(1111111, { version });

    // const index = versions.indexOf(versionType);

    // // eslint-disable-next-line no-magic-numbers
    // return +(ver.split('.')[index === -1 ? 0 : index]);
}

export function checkIsVirtual({ mcu } = {}) {
    return mcu === 'Virtual MCU';
}
