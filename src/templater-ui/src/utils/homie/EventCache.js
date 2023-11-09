/* eslint-disable babel/no-unused-expressions */
import { debounce }               from 'throttle-debounce';
// import store                      from '../../store';
// import { callValErrNotification } from '../../actions/interface';

export default class EventCache {
    constructor({ handler, debounceTime = 100, cacheSize = 15000 } = {}) {  // eslint-disable-line  no-magic-numbers
        this.events     = [];
        this.handler    = handler;
        this.cacheSize  = cacheSize;
        this.length     = 0;
        this.overflowed = false;

        this.processDebounced = debounce(debounceTime, this.process);
    }

    push = (event, withoutProcessing = false) => {
        // console.log('%%% Push event', event);

        if (this.overflowed) return;

        if (this.length < this.cacheSize) {
            this.events.push(event);
            this.length++;

            if (!withoutProcessing) {
                this.processDebounced();
            }
        } else {
            this.overflowed = true;

            // store.dispatch(callValErrNotification({
            //     meta    : 'EVENT_CACHE_LIMIT',
            //     title   : 'Event cache limit exceeded',
            //     message : `Please, reload page and try again. Current limit: ${this.cacheSize}`
            // }));
            console.warn('Event cache limit exceeded', `Please, reload app and try again. Current limit: ${this.cacheSize}`);
        }
    }

    process = () => {
        // console.log('### Starting events processing', this.length);

        const updateSchema = this.reduce();

        this.handler(updateSchema);
    }

    reduce = () => {
        const updateSchema = { devices: {}, thresholds: {}, eventsToRemove: new Set() };

        let event;

        while (event = this.events.shift()) {   // eslint-disable-line no-cond-assign
            switch (event.type) {       // eslint-disable-line default-case
                case 'ADD_EVENT':
                    this._mapAddEvent(updateSchema, event.data);
                    break;
                case 'UPDATE_EVENT':
                    this._mapUpdateEvent(updateSchema, event.data);
                    break;
            }
        }

        this.length = 0;
        this.overflowed = false;

        return updateSchema;
    }

    _mapAddEvent = (updateSchema, event) => {
        switch (event.type) {       // eslint-disable-line default-case
            case 'DEVICE':
                this._addDevice(updateSchema, event);
                break;
            case 'NODE':
                this._addDeviceAttribute(updateSchema, event, 'nodes');
                break;
            case 'SENSOR':
                this._addNodeAttribute(updateSchema, event, 'sensors');
                break;
            case 'DEVICE_TELEMETRY':
                this._addDeviceAttribute(updateSchema, event, 'telemetry');
                break;
            case 'DEVICE_OPTION':
                this._addDeviceAttribute(updateSchema, event, 'options');
                break;
            case 'NODE_TELEMETRY':
                this._addNodeAttribute(updateSchema, event, 'telemetry');
                break;
            case 'NODE_OPTION':
                this._addNodeAttribute(updateSchema, event, 'options');
                break;
                // case 'THRESHOLD':
                //     this._addThreshold(updateSchema, event);
                // break;
        }
    }

    _mapUpdateEvent = (updateSchema, event) => {
        switch (event.type) {       // eslint-disable-line default-case
            case 'DEVICE':
                this._updateDeviceAttribute(updateSchema, event);
                break;
            case 'NODE':
                this._updateNodeAttribute(updateSchema, event);
                break;
            case 'DEVICE_OPTION':
                this._updateDeviceProperty(updateSchema, event, 'options');
                break;
            case 'DEVICE_TELEMETRY':
                this._updateDeviceProperty(updateSchema, event, 'telemetry');
                break;
            case 'NODE_OPTION':
                this._updateNodeProperty(updateSchema, event, 'options');
                break;
            case 'NODE_TELEMETRY':
                this._updateNodeProperty(updateSchema, event, 'telemetry');
                break;
            case 'SENSOR':
                this._updateNodeProperty(updateSchema, event, 'sensors');
                break;
            case 'THRESHOLD':
                this._updateThresholdProperty(updateSchema, event);
                break;
        }

        this._addEventToRemove(updateSchema, event);
    }

    _getDevice = (schema, deviceId) => {
        if (!schema.devices[deviceId]) {
            schema.devices[deviceId] = {};
        }

        return schema.devices[deviceId];
    }

    _getDeviceNode = (device, nodeId) => {
        if (!device.nodes) {
            device.nodes = [ { id: nodeId } ];
        }

        return device.nodes.find(({ id }) => id === nodeId);
    }

    _getScenarioThresholds = (schema, scenarioId) => {
        if (!schema.thresholds[scenarioId]) {
            schema.thresholds[scenarioId] = [];
        }

        return schema.thresholds[scenarioId];
    }

    _addDevice = (schema, event) => {
        const { item } = event;

        schema.devices[item.id] = item;
    }

    _addDeviceAttribute = (schema, event, propertyType) => {
        const { deviceId, item } = event;
        const device = this._getDevice(schema, deviceId);

        if (device) {
            if (!device[propertyType]) device[propertyType] = [];

            device[propertyType] = this._mergeListWithNewItems(device[propertyType], [ item ]);
        }
    }

    _addNodeAttribute = (schema, event, propertyType) => {
        const { deviceId, nodeId, item } = event;
        const device = this._getDevice(schema, deviceId);
        const node   = this._getDeviceNode(device, nodeId);

        if (node) {
            if (!node[propertyType]) node[propertyType] = [];
            const isPropertyExist = !!node[propertyType]?.find(property => property?.rootTopic === item?.rootTopic);

            if (!isPropertyExist) node[propertyType].push(item);
            else {
                node[propertyType] = node[propertyType]?.map(property => {
                    if (property?.rootTopic !== item?.rootTopic) return property;

                    const mergedSensors   = this._mergeListWithNewItems(property?.sensors, item?.sensors);
                    const mergedOptions   = this._mergeListWithNewItems(property?.options, item?.options);
                    const mergedTelemetry = this._mergeListWithNewItems(property?.telemetry, item?.telemetry);

                    return ({
                        ...(property || {}),
                        ...(item || {}),
                        sensors   : mergedSensors?.length ? mergedSensors     : void 0,
                        options   : mergedOptions?.length ? mergedOptions     : void 0,
                        telemetry : mergedTelemetry?.length ? mergedTelemetry : void 0
                    });
                });
            }
        }
    }

    _addThreshold = (schema, event) => {
        const { scenarioId, item } = event;
        const thresholds = this._getScenarioThresholds(schema, scenarioId);

        thresholds.push(item);
    }

    _addSubjectProperty = (subject, event, propertyType, propertyId) => {
        if (!subject[propertyType]) {
            subject[propertyType] = [];
        }

        const property = subject[propertyType].find(({ id }) => id  === propertyId);

        if (property) {
            property[event.field] = event.value;
        } else {
            subject[propertyType].push({
                id            : propertyId,
                [event.field] : event.value
            });
        }
    }

    _addEventToRemove = (schema, event) => {
        const { topic } = event;

        if (!topic) return;

        schema.eventsToRemove.add(topic);
    }

    _updateDeviceAttribute = (schema, event) => {
        const device = this._getDevice(schema, event.deviceId);

        device[event.field] = event.value;
    }

    _updateNodeAttribute = (schema, event) => {
        const device = this._getDevice(schema, event.deviceId);
        const node   = this._getDeviceNode(device, event.nodeId);

        if (node) {
            node[event.field] = event.value;
        } else {
            device.nodes.push({
                id            : event.nodeId,
                [event.field] : event.value
            });
        }
    }

    _updateDeviceProperty = (schema, event, propertyType) => {
        const device = this._getDevice(schema, event.deviceId);

        this._addSubjectProperty(device, event, propertyType, event.propertyId);
    }

    _updateNodeProperty = (schema, event, propertyType) => {
        const device = this._getDevice(schema, event.deviceId);
        const node   = this._getDeviceNode(device, event.nodeId);

        if (node) {
            this._addSubjectProperty(node, event, propertyType, event.propertyId);
        } else {
            device.nodes.push({
                id             : event.nodeId,
                [propertyType] : [ {
                    id            : event.propertyId,
                    [event.field] : event.value
                } ]
            });
        }
    }

    _updateThresholdProperty = (schema, event) => {
        this._addSubjectProperty(schema.thresholds, event, event.nodeId, event.propertyId);
    }

    _mergeListWithNewItems(list, newItems) {
        let fullList = [ ...(list || []) ];

        if (!newItems || !newItems?.length) return fullList;

        newItems?.forEach(newItem => {
            const isPropertyExist = !!fullList?.find(property => property?.rootTopic === newItem?.rootTopic);

            if (!isPropertyExist) fullList.push(newItem);
            else {
                fullList = fullList?.map(property => {
                    return property?.rootTopic === newItem?.rootTopic
                        ? ({ ...(property || {}), ...(newItem || {}) })
                        : property;
                });
            }
        });

        return fullList;
    }
}
