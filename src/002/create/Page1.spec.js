import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import Page1 from './Page1';

const props = {
    toggleStartDatePicker: sinon.spy(),
    toggleEndDatePicker: sinon.spy(),
    startDatePickerIsOpen: false,
    endDatePickerIsOpen: false,

    onChange: sinon.spy(),

    description: '',
    start_date: '',
    end_date: '',

    errors: {}
};

describe('Create Commission - Page1', () => {
    it('renders', () => {
        const wrapper = mount(<Page1 {...props} />);

        expect(wrapper.text()).to.include('Commission name');
        expect(wrapper.text()).to.not.include('Commission by');
        expect(wrapper.text()).to.include('Start date');
        expect(wrapper.text()).to.include('Choose');
        expect(wrapper.find('#CreatePageOne').hostNodes()).to.have.lengthOf(1);
        expect(wrapper.find('#CreatePageOneCommissionName').hostNodes()).to.have.lengthOf(1);
        expect(wrapper.find('#CreatePageOneDateFrom').hostNodes()).to.have.lengthOf(1);
        expect(wrapper.find('#CreatePageOneDateTo').hostNodes()).to.have.lengthOf(1);
    });

    it('renders "Commission by" when CbM settings are provided', () => {
        const wrapper = mount(<Page1 {...props} commissionByMetaSettings={{ field: 'field', label: 'label' }} />);

        expect(wrapper.text()).to.include('Commission by');
    });

    it('shows "Now" when start date is "1970-01-01 00:00:00" - CORE-6982', () => {
        const wrapper = mount(<Page1 {...props} start_date={new Date('1970-01-01T00:00:00+00:00')} />);

        expect(wrapper.find('#CreatePageOneDateFrom').at(0).text()).to.include('Now');
    });

});
