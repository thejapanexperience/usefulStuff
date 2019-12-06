import React from 'react';
import dateFns from 'date-fns';
import { mount } from 'enzyme';
import { expect } from 'chai';

import IncidentsList from './IncidentsList';

const incidents = [
    {
        id: 'ddd',
        publisher: { name: 'Pub 1' },
        occurred_at: dateFns.format(dateFns.subDays(new Date(), 3), 'yyyy-MM-dd HH:mm:ss'),
        incident_type: 'volume_clicks'
    },
    {
        id: 'eee',
        publisher: { name: 'Pub 2' },
        occurred_at: '2019-10-20 10:10:10',
        incident_type: 'volume_clicks'
    }
];

describe('IncidentsList', () => {
    it('renders', () => {
        const wrapper = mount(<IncidentsList incidents={incidents} campaign={{ reporting_timezone: 'UTC' }} />);

        expect(wrapper.find('.incident-item').at(0).text()).to.equal('Number of clicksPub 1 ‧ 3 days ago');
        expect(wrapper.find('.incident-item').hostNodes()).to.have.lengthOf(2);
    });
});
