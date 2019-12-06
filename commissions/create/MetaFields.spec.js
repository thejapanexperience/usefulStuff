import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import MetaFields from './MetaFields';

const meta_fields = [
    {
        'name': 'conversion_type',
        'values': []
    },
    {
        'name': 'customer_reference',
        'values': []
    },
    {
        'name': 'advertiser_reference',
        'values': []
    },
    {
        'name': 'country',
        'values': []
    },
    {
        'name': 'vertical',
        'values': []
    },
    {
        'name': 'sku',
        'values': []
    },
    {
        'name': 'cookie_status',
        'values': []
    },
    {
        'name': 'category',
        'values': []
    },
    {
        'name': 'customer_type',
        'values': []
    }
];

const props = {
    onChangeMetaFields: sinon.spy(),
    errors: {
        'meta_fields[0]': 'Meta field 1 is incorrect'
    },
    meta_fields: [],
    dropdownItemOptions: {
        countries : [{
            'printable_name': 'Afghanistan',
            'iso': 'AF',
        }],
        verticals: [{
            'vertical_id': 1,
            'name': 'B2B',
        }],
        conversionTypes: [{
            'conversion_type_id': 1,
            'conversion_type': 'standard',
            'description': 'Standard Transaction',
        }],
        customerTypes: { existing: 'Existing', new: 'New' }
    }
};

describe('Create Commission - MetaFields ', () => {
    it('renders', () => {
        const wrapper = mount(
            <MetaFields
                {...props}
            />
        );

        expect(wrapper.find('#CreateMetaFields').hostNodes()).to.have.lengthOf(1);
        expect(wrapper.find('#CreateMetaDropdown-conversion_type').hostNodes()).to.have.lengthOf(0);
        expect(wrapper.find('#CreateMetaInput-advertiser_reference').hostNodes()).to.have.lengthOf(0);
        expect(wrapper.find('#CreateMetaDropdown-country').hostNodes()).to.have.lengthOf(0);
        expect(wrapper.find('#CreateMetaDropdown-vertical').hostNodes()).to.have.lengthOf(0);
        expect(wrapper.find('#CreateMetaInput-sku').hostNodes()).to.have.lengthOf(0);
        expect(wrapper.find('#CreateMetaInput-cookie_status').hostNodes()).to.have.lengthOf(0);
        expect(wrapper.find('#CreateMetaInput-category').hostNodes()).to.have.lengthOf(0);
        expect(wrapper.find('#CreateMetaDropdown-customer_type').hostNodes()).to.have.lengthOf(0);
    });

    it('renders MetaFields inputs', () => {
        const wrapper = mount(
            <MetaFields
                {...props}
                meta_fields={meta_fields}
            />
        );

        expect(wrapper.find('#CreateMetaFields').hostNodes()).to.have.lengthOf(1);
        expect(wrapper.text()).to.include('Meta field 1 is incorrect', 'meta field error is displayed');
        expect(wrapper.find('#CreateMetaDropdown-conversion_type').hostNodes()).to.have.lengthOf(1);
        expect(wrapper.find('#CreateMetaInput-advertiser_reference').hostNodes()).to.have.lengthOf(1);
        expect(wrapper.find('#CreateMetaDropdown-country').hostNodes()).to.have.lengthOf(1);
        expect(wrapper.find('#CreateMetaDropdown-vertical').hostNodes()).to.have.lengthOf(1);
        expect(wrapper.find('#CreateMetaInput-sku').hostNodes()).to.have.lengthOf(1);
        expect(wrapper.find('#CreateMetaInput-cookie_status').hostNodes()).to.have.lengthOf(1);
        expect(wrapper.find('#CreateMetaInput-category').hostNodes()).to.have.lengthOf(1);
        expect(wrapper.find('#CreateMetaDropdown-customer_type').hostNodes()).to.have.lengthOf(1);
    });
});
