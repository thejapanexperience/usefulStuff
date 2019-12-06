import React from 'react';

import { cleanup, fireEvent } from 'app/utils/@testing-library/react';
import { renderConnected } from 'app/utils/@testing-library/react-redux';

import FraudPage from '../';
import { initialState } from '../pageState';

import api from 'app/api';
import { mockCampaign, mockIncidents } from './mockApiResponses';

const makeMocks = ({
    mockIncidents,
    mockCampaign
}) => {
    api.v2CampaignFraudIncidents.actionCreators.fetchAction = jest.fn(() => {
        return {
            type: 'API:V1/FRAUD/INCIDENTS:SUCCESS',
            payload: mockIncidents,
        };
    });

    api.campaign.actionCreators.fetchAction = jest.fn(() => {
        return {
            type: 'API:CAMPAIGN:SUCCESS',
            payload: mockCampaign,
        };
    });
};

beforeEach( () => {
    cleanup();
    console.warn = jest.fn(); // eslint-disable-line no-console
});

test('Fraud with no incidents to display', () => {
    makeMocks({
        mockCampaign,
        mockIncidents: []
    });

    const {
        getByText,
        queryByTestId
    } = renderConnected(<FraudPage/>, initialState);

    // standard page layout stuff
    expect(getByText('Incidents')).toExist;
    expect(getByText('Actions')).toExist;
    expect(getByText('Choose...')).toExist;

    // no incidents
    expect(getByText('There are no incident details to display ...')).toExist;
    expect(queryByTestId('fraud_incidents_list_item')).toBeNull;
});

test('Fraud with incidents to display', () => {
    makeMocks({
        mockCampaign,
        mockIncidents
    });

    jest.spyOn(window, 'alert').mockImplementation(() => {});

    const {
        getByText,
        // queryByText,
        getAllByTestId
    } = renderConnected(<FraudPage/>, initialState);

    // general stuff
    expect(getByText('Incidents')).toExist;
    expect(getByText('Actions')).toExist;
    expect(getByText('Choose...')).toExist;

    // GEORGI - you can delete the commented out assertions and replace them with something sensible

    // seeing list items in list
    const listItems = getAllByTestId('fraud_incidents_list_item');
    expect(listItems.length).toBe(3);
    expect(getByText('Leadsbox')).toExist;
    // expect(queryByText('123')).toBeNull;

    // clicking on list items causes specific info aobut fraud incidents to be displayed
    fireEvent.click(listItems[1]);
    // expect(getByText('123')).toExist;
    // expect(queryByText('1001l1234')).toBeNull;

    fireEvent.click(listItems[2]);
    // expect(getByText('1001l1234')).toExist;
    // expect(queryByText('123')).toBeNull;

    // selecting option from actions dropdown
    fireEvent.click(getByText('Choose...'));
    // expect((getByText('Download click csv'))).toExist;
    // fireEvent.click(getByText('Download click csv'));
    // expect(window.alert).toHaveBeenCalledWith('onDownloadClickCSV');
});
