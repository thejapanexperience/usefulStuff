//@flow
import Component from './index';
import { networkFeature, allOf } from 'app/utils/availability';
import type { RouteType, DevRouteType } from 'app/types';


const Fraud: RouteType = {
    Component,
    version: 'v3',
    path: '/v2/reporting/fraud',
    exact: true,
    availability: allOf(networkFeature('usability_phase1'), networkFeature('fraud_detection'))
};

const DevFraud: DevRouteType = {
    ...Fraud,
    context: 'advertiser'
};

const routes = [Fraud];
const devRoutes = [DevFraud];

export {
    routes as default,
    devRoutes
};
