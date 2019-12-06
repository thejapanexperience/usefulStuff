import { expect } from 'chai';
import { customerTypesListObject } from './defaults';

import {
    convertDaysToSeconds,
    convertSecondsToDays,
    getPerformanceValueLabel,
    getInputSelectOptions,
    getSortedPartners,
    checkPerformanceValueFormat,
    checkCookiePeriodFormat,
    checkisNotAllPartners,
    transformCommissionObjectForApi,
    transformPublishersForMultiSelect,
    transformGroupsForMultiSelect,
    getDropdownItems,
    formatCustomMetaFieldName,
    getGroupedRates,
    getActiveValues,
    checkEditIsUnchanged,
    processSaveErrors
} from './helpers';

it('Create helpers convertDaysToSeconds converts days to seconds', () => {
    const result = convertDaysToSeconds(3);
    const expected = 259200;
    expect(result).to.equal(expected);
});

it('Create helpers convertSecondsToDays converts seconds to days', () => {
    const result = convertSecondsToDays(432000);
    const expected = 5;
    expect(result).to.equal(expected);
});

it('Create helpers getPerformanceValueLabel returns a label with currencies for financial models', () => {
    const performance_model = 'cpc';
    const iso = 'GBP';

    const result = getPerformanceValueLabel(performance_model, iso);
    const expected = 'Commission £GBP';
    expect(result).to.equal(expected);
});

it('Create helpers getPerformanceValueLabel works with RMB', () => {
    const performance_model = 'fixed_cpa';
    const iso = 'RMB';

    const result = getPerformanceValueLabel(performance_model, iso);
    const expected = 'Commission ¥RMB';
    expect(result).to.equal(expected);
});

it('Create helpers getPerformanceValueLabel returns the label with the iso if no symbol can be found', () => {
    const performance_model = 'fixed_cpa';
    const iso = 'UUU';

    const result = getPerformanceValueLabel(performance_model, iso);
    const expected = 'Commission UUU';
    expect(result).to.equal(expected);
});

it('Create helpers getPerformanceValueLabel returns without a symbol or iso is no iso is provided', () => {
    const performance_model = 'fixed_cpa';

    const result = getPerformanceValueLabel(performance_model);
    const expected = 'Commission';
    expect(result).to.equal(expected);
});

it('Create helpers getPerformanceValueLabel returns a label with % for percentage_cpa', () => {
    const performance_model = 'percentage_cpa';

    const result = getPerformanceValueLabel(performance_model);
    const expected = 'Commission %';
    expect(result).to.equal(expected);
});

it('Create helpers getSortedPartners returns an empty array with no input', () => {
    const publishers = [];
    const groups = [];

    const result = getSortedPartners({ publishers, groups });
    expect(result).to.deep.equal([]);
});

it('Create helpers getSortedPartners returns a sorted list of publishers and groups', () => {
    const publishers = [{ label: 'b' }, { label: 'c' }];
    const groups = [{ label: 'd' }, { label: 'a' }];

    const result = getSortedPartners({ publishers, groups });
    expect(result[0].label).to.equal('a');
    expect(result[1].label).to.equal('b');
    expect(result[2].label).to.equal('c');
    expect(result[3].label).to.equal('d');
    expect(result.length).to.equal(4);
});

it('Create helpers getSortedPartners appends an empty value if isNotAllPartners is true and Is InitialList is true', () => {
    const publishers = [{ label: 'b' }, { label: 'c' }];
    const groups = [{ label: 'd' }, { label: 'a' }];
    const isNotAllPartners = true;
    const isInitialList = true;

    const result = getSortedPartners({ publishers, groups, isNotAllPartners, isInitialList });

    expect(result[0].label).to.equal('a');
    expect(result[1].label).to.equal('b');
    expect(result[2].label).to.equal('c');
    expect(result[3].label).to.equal('d');
    expect(result[4].label).to.include('Showing top 100 results');
    expect(result[4].id).to.equal('');
    expect(result.length).to.equal(5);
});

it('Create helpers checkPerformanceValueFormat checks that the value is a string number that can contain a decimal or an empty string', () => {
    expect(checkPerformanceValueFormat('12')).not.to.be.null;
    expect(checkPerformanceValueFormat('12.')).not.to.be.null;
    expect(checkPerformanceValueFormat('12.3')).not.to.be.null;
    expect(checkPerformanceValueFormat('')).not.to.be.null;
    expect(checkPerformanceValueFormat('12.3.9')).to.be.null;
    expect(checkPerformanceValueFormat('12y')).to.be.null;
});

it('Create helpers checkCookiePeriodFormat checks that the value is a string whole number below 366 or an empty string', () => {
    expect(checkCookiePeriodFormat('12')).not.to.be.false;
    expect(checkCookiePeriodFormat('366')).to.be.false;
    expect(checkCookiePeriodFormat('')).not.to.be.false;
    expect(checkCookiePeriodFormat('12y')).to.be.false;
    expect(checkCookiePeriodFormat('y')).to.be.false;
});

it(`
Create helpers checkisNotAllPartners returns true if the number of partners is greater than the pagination limit with no memo default
`, () => {
        const partnersMemo = {
            searches: {},
            count: 0,
            isNotAllPartners: false
        };

        const publishersList = {
            publishers: [],
            count: 105,
            limit: 100
        };

        const result = checkisNotAllPartners({ partnersMemo, publishersList });
        expect(result).to.be.true;
    });

it('Create helpers checkisNotAllPartners returns false if the number of partners is less than the pagination limit with no memo default', () => {
    const partnersMemo = {
        searches: {},
        count: 0,
        isNotAllPartners: false
    };

    const publishersList = {
        publishers: [],
        count: 78,
        limit: 100
    };

    const result = checkisNotAllPartners({ partnersMemo, publishersList });
    expect(result).to.be.false;
});

it('Create helpers checkisNotAllPartners returns true if the memo has isNotAllPartners set to true', () => {
    const partnersMemo = {
        searches: {
            '': [{ label: 'e' }]
        },
        count: 0,
        isNotAllPartners: true,
    };

    const publishersList = {
        publishers: [],
        count: 78,
        limit: 100
    };

    const result = checkisNotAllPartners({ partnersMemo, publishersList });
    expect(result).to.be.true;
});

const testRate = {
    id: [{ id: 3, type: 'publisher' }],
    performance_value: '2',
    performance_model: 'cpc',
    cookie_period: 10
};

const campaignRate = {
    id: [],
    performance_value: '3',
    performance_model: 'fixed_cpa',
    cookie_period: ''
};

const testCommission = {
    description: 'description',
    start_date: new Date(Date.UTC(2019, 0)),
    end_date: new Date(Date.UTC(2020, 0)),
    meta_fields: [],
    rates: [testRate, campaignRate]
};

it('Create helpers transformCommissionObjectForApi returns a transformed commission object', () => {
    const commission = testCommission;
    const campaignId = 1;

    const result = transformCommissionObjectForApi(commission, campaignId);
    const expected = {
        description: 'description',
        start_date: '2019-01-01T00:00:00.000Z',
        end_date: '2020-01-01T00:00:00.000Z',
        meta_fields: [],
        rates: [{ id: '3', label: 'label', performance_value: 2, performance_model: 'cpc', cookie_period: 864000, type: 'publisher' }]
    };
    expect(result.description).to.equal(expected.description);
    expect(result.start_date).to.equal(expected.start_date);
    expect(result.end_date).to.equal(expected.end_date);
    expect(result.rates[0].id).to.equal(expected.rates[0].id);
    expect(result.rates[0].performance_value).to.equal(expected.rates[0].performance_value);
});

it('Create helpers transformCommissionObjectForApi returns a transformed commission object with a null end_date', () => {
    const commission = { ...testCommission, end_date: '' };
    const campaignId = '2';

    const result = transformCommissionObjectForApi(commission, campaignId);
    expect(result.end_date).to.be.null;
});

it('Create helpers transformCommissionObjectForApi returns a transformed commission object with no cookie_period', () => {
    const commission = { ...testCommission,  rates: [{ ...testRate, cookie_period: '' }] };

    const result = transformCommissionObjectForApi(commission);

    expect(Object.keys(result.rates[0]).includes('cookie_period')).to.be.false;
    expect(Object.keys(result.rates[0]).includes('performance_value')).to.be.true;
});

it('Create helpers transformCommissionObjectForApi returns a transformed commission object with empty meta_field values', () => {
    const commission = { ...testCommission,  meta_fields: [{ name: 'name', values: [''] }], rates: [] };

    const result = transformCommissionObjectForApi(commission);

    expect(result.meta_fields[0].values).to.deep.equal([]);
});

const testRateMultiplePartners = {
    id: [{ id: 3, type: 'publisher' }, { id: 7, type: 'publisher' }, { id: 9, type: 'publisher' }],
    label: 'label',
    performance_value: '2',
    performance_model: 'cpc',
    cookie_period: 10
};

it(`Create helpers transformCommissionObjectForApi returns a transformed commission object
    with multiple rates for an individual commission with multiple partners`, () => {
        const commission = { ...testCommission, rates: [testRateMultiplePartners] };
        const campaignDefaultCookieRate = 30;

        const result = transformCommissionObjectForApi(commission, campaignDefaultCookieRate);
        expect(result.rates.length).to.equal(3);
        expect(result.rates[0].id).to.equal('3');
        expect(result.rates[1].id).to.equal('7');
        expect(result.rates[2].id).to.equal('9');
    });

it('Create helpers getInputSelectOptions returns an empty array with no input', () => {
    const partnersMemo = {
        searches: {},
        count: 0
    };
    const partnersSearchString = '';
    const sortedPartners = [];
    const rate = testRate;
    const rates = [rate];

    const result = getInputSelectOptions({ partnersMemo, partnersSearchString, sortedPartners, rates, rate });
    expect(result).to.deep.equal([]);
});

it('Create helpers getInputSelectOptions returns a sorted array of publishers and groups', () => {
    const partnersMemo = {
        searches: {},
        count: 0
    };
    const partnersSearchString = '';
    const sortedPartners = [{ label: 'a', id: 1 }, { label: 'b', id: 2 }, { label: 'c', id: 3 }, { label: 'd', id: 4 }];
    const rate = testRate;
    const rates = [rate];

    const result = getInputSelectOptions({ partnersMemo, partnersSearchString, sortedPartners, rates, rate });
    expect(result[0].label).to.equal('a');
    expect(result.length).to.equal(4);
});

it('Create helpers getInputSelectOptions returns a memoised list if it exists instead of the sorted array', () => {
    const partnersMemo = {
        searches: { '': [{ label: 'e', id: 5 }] },
        count: 0
    };
    const partnersSearchString = '';
    const sortedPartners = [{ label: 'b', id: 2 }, { label: 'c', id: 3 }];
    const rate = testRate;
    const rates = [rate];

    const result = getInputSelectOptions({ partnersMemo, partnersSearchString, sortedPartners, rates, rate });
    expect(result[0].label).to.equal('e');
    expect(result.length).to.equal(1);
});

it('Create helpers getInputSelectOptions a memoised list from a specific search string', () => {
    const partnersMemo = {
        searches: {
            '': [{ label: 'e', id: 5 }],
            f: [{ label: 'f', id: 6 }, { label: 'ff', id: 66 }]
        },
        count: 0
    };
    const partnersSearchString = 'f';
    const sortedPartners = [{ label: 'b', id: 2 }, { label: 'c', id: 3 }];
    const rate = testRate;
    const rates = [rate];

    const result = getInputSelectOptions({ partnersMemo, partnersSearchString, sortedPartners, rates, rate });
    expect(result[0].label).to.equal('f');
    expect(result[1].label).to.equal('ff');
    expect(result.length).to.equal(2);
});

it('Create helpers getInputSelectOptions filters out options that have been selected in another rate', () => {
    const partnersMemo = {
        searches: {},
        count: 0
    };
    const partnersSearchString = 'f';
    const sortedPartners = [{ label: 'b', id: 2 }, { label: 'c', id: 3 }];

    const rate = testRate;
    const otherRate = {
        id: [{ id: 6, type: 'publisher' }],
        label: 'label',
        performance_value: '2',
        performance_model: 'cpc',
        cookie_period: 10
    };
    const rates = [rate, otherRate];

    const result = getInputSelectOptions({ partnersMemo, partnersSearchString, sortedPartners, rates, rate });
    expect(result[0].label).to.equal('b');
    expect(result.length).to.equal(2);
});

it('Create helpers getInputSelectOptions filters out options that have been selected in another rate and returns a memoised list', () => {
    const partnersMemo = {
        searches: {
            '': [{ label: 'e', id: 5 }],
            f: [{ label: 'f', id: 6 }, { label: 'ff', id: 66 }]
        },
        count: 0
    };
    const partnersSearchString = 'f';
    const sortedPartners = [{ label: 'b', id: 2 }, { label: 'c', id: 3 }];

    const rate = testRate;
    const otherRate = {
        id: [{ id: 6, type: 'publisher' }],
        label: 'label',
        performance_value: '2',
        performance_model: 'cpc',
        cookie_period: 10
    };
    const rates = [rate, otherRate];

    const result = getInputSelectOptions({ partnersMemo, partnersSearchString, sortedPartners, rates, rate });
    expect(result[0].label).to.equal('ff');
    expect(result.length).to.equal(1);
});

it('Create helpers transformPublishersForMultiSelect returns formatted publishers ', () => {
    const testPublishers = {
        publishers: [
            {
                publisher: {
                    publisher_id: 777,
                    account_name: 'test_publisher'
                }
            }
        ]
    };

    const result = transformPublishersForMultiSelect(testPublishers);
    expect(result[0].id).to.equal('777');
    expect(result[0].label).to.equal('test_publisher');
    expect(result[0].type).to.equal('publisher');
});

it('Create helpers transformGroupsForMultiSelect returns formatted groups ', () => {
    const testGroups = [
        {
            commission_group: {
                commission_group_id: 888,
                name: 'group_name',
                publishers: [
                    {
                        publisher: {
                            publisher_id: 999,
                            account_name: 'test_publisher_in_group'
                        }
                    }
                ]
            }
        }
    ];

    const result = transformGroupsForMultiSelect(testGroups);
    expect(result[0].id).to.equal('888');
    expect(result[0].label).to.equal('group_name');
    expect(result[0].type).to.equal('group');
});

it('Create helpers formatCustomMetaFieldName returns a fomatted field name', () => {
    expect(formatCustomMetaFieldName('test')).to.equal('Test');
    expect(formatCustomMetaFieldName('Test')).to.equal('Test');
    expect(formatCustomMetaFieldName('test_string')).to.equal('Test string');
});

it('Create helpers getDropdownItems returns an array of correctly formatted and sorted country options', () => {
    const key = 'country';
    const dropdownItemOptions = {
        countries: [
            {
                printable_name: 'Canada',
                iso: 'CAN'
            },
            {
                printable_name: 'Algeria',
                iso: 'ALG'
            }
        ]
    };

    const result = getDropdownItems({ key, dropdownItemOptions });
    expect(result[0].label).to.equal('All');
    expect(result[0].value).to.equal('');
    expect(result[1].label).to.equal('Algeria');
    expect(result[2].value).to.equal('CAN');
});

it('Create helpers getDropdownItems returns an array of correctly formatted conversion_type options', () => {
    const key = 'conversion_type';
    const dropdownItemOptions = {
        conversionTypes: [
            {
                conversion_type_id: '111',
                description: 'One'
            },
            {
                conversion_type_id: '222',
                description: 'Two'
            }
        ]
    };

    const result = getDropdownItems({ key, dropdownItemOptions });
    expect(result[0].label).to.equal('All');
    expect(result[0].value).to.equal('');
    expect(result[1].label).to.equal('One');
    expect(result[2].value).to.equal('222');
});

it('Create helpers getDropdownItems returns an array of correctly formatted customer_type options', () => {
    const key = 'customer_type';
    const dropdownItemOptions = {
        customerTypes: customerTypesListObject
    };

    const result = getDropdownItems({ key, dropdownItemOptions });
    expect(result[0].label).to.equal('All');
    expect(result[0].value).to.equal('');
    expect(result[1].label).to.equal('New');
    expect(result[2].value).to.equal('existing');
});

it('Create helpers getDropdownItems returns an array of correctly formatted and sorted vertical options', () => {
    const key = 'vertical';
    const dropdownItemOptions = {
        verticals: [
            {
                name: 'Bee',
                vertical_id: 'BBB'
            },
            {
                name: 'Ayy',
                vertical_id: 'AAA'
            }
        ]
    };

    const result = getDropdownItems({ key, dropdownItemOptions });
    expect(result[0].label).to.equal('All');
    expect(result[0].value).to.equal('');
    expect(result[1].label).to.equal('Ayy');
    expect(result[2].value).to.equal('BBB');
});

it('Create helpers getDropdownItems returns an array of correctly formatted and sorted vertical options', () => {
    const key = 'wrong_key';
    const dropdownItemOptions = {
        verticals: [
            {
                name: 'Bee',
                vertical_id: 'BBB'
            },
            {
                name: 'Ayy',
                vertical_id: 'AAA'
            }
        ]
    };

    const result = getDropdownItems({ key, dropdownItemOptions });
    expect(result.length).to.equal(0);
});

it('Create helpers getGroupedRates returns an array of grouped rates plus an empty campaign commission', () => {
    const rates = [
        {
            'id': '300451',
            'type': 'publisher',
            'name': 'adamcable',
            'performance_model': 'fixed_cpa',
            'performance_value': 4,
            'cookie_period': null
        },
        {
            'id': '300469',
            'type': 'publisher',
            'name': 'adconiondirect',
            'performance_model': 'fixed_cpa',
            'performance_value': 4,
            'cookie_period': null
        },
        {
            'id': '300345',
            'type': 'publisher',
            'name': 'adwarm',
            'performance_model': 'fixed_cpa',
            'performance_value': 4,
            'cookie_period': null
        }
    ];

    const expected = [
        {
            'id': [
                {
                    'id': '300451',
                    'label': 'adamcable',
                    'type': 'publisher'
                },
                {
                    'id': '300469',
                    'label': 'adconiondirect',
                    'type': 'publisher'
                },
                {
                    'id': '300345',
                    'label': 'adwarm',
                    'type': 'publisher'
                }
            ],
            'performance_value': 4,
            'performance_model': 'fixed_cpa',
            'cookie_period': ''
        },
        {
            'id': [],
            'performance_value': '',
            'performance_model': 'fixed_cpa',
            'cookie_period': ''
        }
    ];

    const result = getGroupedRates(rates);
    expect(result.length).to.equal(2);
    expect(result[0].id.length).to.equal(3);
    expect(result[0].id).to.deep.equal(expected[0].id);
    expect(result[1]).to.deep.equal(expected[1]);
});

it('Create helpers getGroupedRates returns an array of grouped rates plus an empty campaign commission with cookie_periods', () => {
    const rates = [
        {
            'id': '300451',
            'type': 'publisher',
            'name': 'adamcable',
            'performance_model': 'fixed_cpa',
            'performance_value': 4,
            'cookie_period': 2592000
        },
        {
            'id': '300469',
            'type': 'publisher',
            'name': 'adconiondirect',
            'performance_model': 'fixed_cpa',
            'performance_value': 4,
            'cookie_period': 2592000
        },
        {
            'id': '300345',
            'type': 'publisher',
            'name': 'adwarm',
            'performance_model': 'fixed_cpa',
            'performance_value': 4,
            'cookie_period': 2592000
        }
    ];

    const expected = [
        {
            'id': [
                {
                    'id': '300451',
                    'label': 'adamcable',
                    'type': 'publisher'
                },
                {
                    'id': '300469',
                    'label': 'adconiondirect',
                    'type': 'publisher'
                },
                {
                    'id': '300345',
                    'label': 'adwarm',
                    'type': 'publisher'
                }
            ],
            'performance_value': 4,
            'performance_model': 'fixed_cpa',
            'cookie_period': 30
        },
        {
            'id': [],
            'performance_value': '',
            'performance_model': 'fixed_cpa',
            'cookie_period': ''
        }
    ];

    const result = getGroupedRates(rates);
    expect(result.length).to.equal(2);
    expect(result[0].cookie_period).to.equal(expected[0].cookie_period);
});


it('Create helpers getGroupedRates returns an array of grouped rates sorted by performance value', () => {
    const rates = [
        {
            'id': '300472',
            'type': 'publisher',
            'name': 'affiliateweb',
            'performance_model': 'fixed_cpa',
            'performance_value': 2,
            'cookie_period': null
        },
        {
            'id': '300451',
            'type': 'publisher',
            'name': 'adamcable',
            'performance_model': 'fixed_cpa',
            'performance_value': 1,
            'cookie_period': null
        },
        {
            'id': '300450',
            'type': 'publisher',
            'name': 'androidpp',
            'performance_model': 'fixed_cpa',
            'performance_value': 3,
            'cookie_period': null
        },
    ];

    const expected = [
        {
            'id': [
                {
                    'id': '300451',
                    'label': 'adamcable',
                    'type': 'publisher'
                }
            ],
            'performance_value': 1,
            'performance_model': 'fixed_cpa',
            'cookie_period': ''
        },
        {
            'id': [
                {
                    'id': '300472',
                    'label': 'affiliateweb',
                    'type': 'publisher'
                }
            ],
            'performance_value': 2,
            'performance_model': 'fixed_cpa',
            'cookie_period': ''
        },
        {
            'id': [
                {
                    'id': '300450',
                    'label': 'androidpp',
                    'type': 'publisher'
                }
            ],
            'performance_value': 3,
            'performance_model': 'fixed_cpa',
            'cookie_period': ''
        },
        {
            'id': [],
            'performance_value': '',
            'performance_model': 'fixed_cpa',
            'cookie_period': ''
        }
    ];

    const result = getGroupedRates(rates);
    expect(result.length).to.equal(4);
    expect(result).to.deep.equal(expected);
});

it('Create helpers getGroupedRates returns an array of grouped rates with a campaign commission', () => {
    const rates = [
        {
            'id': '300451',
            'type': 'campaign',
            'name': 'adamcable',
            'performance_model': 'fixed_cpa',
            'performance_value': 4,
            'cookie_period': null
        },

    ];

    const expected = [
        {
            'id': [],
            'performance_value': '',
            'performance_model': 'fixed_cpa',
            'cookie_period': ''
        },
        {
            'id': [],
            'performance_value': 4,
            'performance_model': 'fixed_cpa',
            'cookie_period': ''
        }
    ];

    const result = getGroupedRates(rates);
    expect(result.length).to.equal(2);
    expect(result[0]).to.deep.equal(expected[0]);
    expect(result[1]).to.deep.equal(expected[1]);
});

it('Create helpers getActiveValues returns an object containing commission properties with no values', () => {
    const commissionId = null;
    const commissionToEdit = null;
    const description = '';
    const start_date = null;
    const end_date = null;
    const meta_fields = [{
        'name': 'sku',
        'values': []
    },];
    const rates = [];
    const isActiveEdit = false;

    const result = getActiveValues ({
        commissionId,
        commissionToEdit,
        description,
        start_date,
        end_date,
        meta_fields,
        rates,
        isActiveEdit
    });

    const expected = {
        active_description: description,
        active_start_date: start_date,
        active_end_date: end_date,
        active_meta_fields: meta_fields,
        active_rates: rates,
        has_active_meta_field_values: false
    };

    expect(result.active_description).to.equal(expected.active_description);
    expect(result.active_start_date).to.equal(expected.active_start_date);
    expect(result.active_end_date).to.equal(expected.active_end_date);
    expect(result.active_meta_fields).to.deep.equal(expected.active_meta_fields);
    expect(result.active_rates).to.deep.equal(expected.active_rates);
    expect(result.has_active_meta_field_values).to.equal(expected.has_active_meta_field_values);
});

it('Create helpers getActiveValues returns an object containing commission properties with values', () => {
    const commissionId = null;
    const commissionToEdit = null;
    const description = 'description';
    const start_date = new Date(Date.UTC(2019, 0));
    const end_date = new Date(Date.UTC(2020, 0));
    const meta_fields = [
        {
            'name': 'sku',
            'values': [
                'One'
            ]
        },
    ];
    const rates = [
        {
            'id': [
                {
                    'id': '300451',
                    'label': 'adamcable',
                    'type': 'publisher'
                }
            ],
            'performance_value': '2',
            'performance_model': 'fixed_cpa',
            'cookie_period': ''
        },
        {
            'id': [],
            'performance_value': '',
            'performance_model': 'fixed_cpa',
            'cookie_period': ''
        }
    ];
    const isActiveEdit = false;

    const result = getActiveValues ({
        commissionId,
        commissionToEdit,
        description,
        start_date,
        end_date,
        meta_fields,
        rates,
        isActiveEdit
    });
    const expected = {
        active_description: description,
        active_start_date: start_date,
        active_end_date: end_date,
        active_meta_fields: meta_fields,
        active_rates: rates,
        has_active_meta_field_values: true
    };

    expect(result.active_description).to.equal(expected.active_description);
    expect(result.active_start_date).to.equal(expected.active_start_date);
    expect(result.active_end_date).to.equal(expected.active_end_date);
    expect(result.active_meta_fields).to.deep.equal(expected.active_meta_fields);
    expect(result.active_rates).to.deep.equal(expected.active_rates);
    expect(result.has_active_meta_field_values).to.equal(expected.has_active_meta_field_values);
});

it('Create helpers getActiveValues returns an object containing commission properties with values from an edited commission', () => {
    const commissionId = '111111l87';
    const commissionToEdit = {
        id: '111111l87',
        description: 'TwoEdit',
        start_date: '2019-09-23T10:40:04+00:00',
        end_date: null,
        status: 'ACTIVE',
        meta_fields: [
            {
                'name': 'sku',
                'values': [
                    'Two'
                ]
            }
        ],
        rates: [
            {
                'id': '300451',
                'type': 'publisher',
                'name': 'adamcable',
                'performance_model': 'fixed_cpa',
                'performance_value': 1,
                'cookie_period': null
            },
            {
                'id': '300472',
                'type': 'publisher',
                'name': 'affiliateweb',
                'performance_model': 'fixed_cpa',
                'performance_value': 1,
                'cookie_period': null
            },
            {
                'id': '300659',
                'type': 'campaign',
                'performance_model': 'fixed_cpa',
                'performance_value': 3,
                'cookie_period': null
            }
        ]
    };
    const description = '';
    const start_date = null;
    const end_date = null;
    const meta_fields = [
        {
            'name': 'sku',
            'values': []
        }
    ];
    const rates = [];
    const isActiveEdit = false;

    const result = getActiveValues ({
        commissionId,
        commissionToEdit,
        description,
        start_date,
        end_date,
        meta_fields,
        rates,
        isActiveEdit
    });
    const expected = {
        active_description: commissionToEdit.description,
        active_start_date: new Date(commissionToEdit.start_date),
        active_end_date: commissionToEdit.end_date,
        active_meta_fields: commissionToEdit.meta_fields,
        active_rates: [
            {
                'id': [
                    {
                        'id': '300451',
                        'label': 'adamcable',
                        'type': 'publisher'
                    },
                    {
                        'id': '300472',
                        'label': 'affiliateweb',
                        'type': 'publisher'
                    }
                ],
                'performance_value': 1,
                'performance_model': 'fixed_cpa',
                'cookie_period': ''
            },
            {
                'id': [],
                'performance_value': 3,
                'performance_model': 'fixed_cpa',
                'cookie_period': ''
            }
        ],
        has_active_meta_field_values: true
    };

    expect(result.active_description).to.equal(expected.active_description);
    expect(result.active_start_date.toISOString()).to.equal(expected.active_start_date.toISOString());
    expect(result.active_end_date).to.equal(expected.active_end_date);
    expect(result.active_meta_fields).to.deep.equal(expected.active_meta_fields);
    expect(result.active_rates).to.deep.equal(expected.active_rates);
    expect(result.has_active_meta_field_values).to.equal(expected.has_active_meta_field_values);
});

it(`Create helpers getActiveValues returns an object containing commission properties with values
ignoring the edited commission if isActiveEdit is true`, () => {
        const commissionId = '111111l87';
        const commissionToEdit = {
            id: '111111l87',
            description: 'TwoEdit',
            start_date: '2019-09-23T10:40:04+00:00',
            end_date: null,
            status: 'ACTIVE',
            meta_fields: [
                {
                    'name': 'sku',
                    'values': [
                        'Two'
                    ]
                }
            ],
            rates: [
                {
                    'id': '300451',
                    'type': 'publisher',
                    'name': 'adamcable',
                    'performance_model': 'fixed_cpa',
                    'performance_value': 1,
                    'cookie_period': null
                },
                {
                    'id': '300472',
                    'type': 'publisher',
                    'name': 'affiliateweb',
                    'performance_model': 'fixed_cpa',
                    'performance_value': 1,
                    'cookie_period': null
                },
                {
                    'id': '300659',
                    'type': 'campaign',
                    'performance_model': 'fixed_cpa',
                    'performance_value': 3,
                    'cookie_period': null
                }
            ]
        };
        const description = 'description';
        const start_date = new Date(Date.UTC(2019, 0));
        const end_date = new Date(Date.UTC(2020, 0));
        const meta_fields = [
            {
                'name': 'sku',
                'values': [
                    'One'
                ]
            },
        ];
        const rates = [
            {
                'id': [
                    {
                        'id': '300451',
                        'label': 'adamcable',
                        'type': 'publisher'
                    }
                ],
                'performance_value': '2',
                'performance_model': 'fixed_cpa',
                'cookie_period': ''
            },
            {
                'id': [],
                'performance_value': '',
                'performance_model': 'fixed_cpa',
                'cookie_period': ''
            }
        ];
        const isActiveEdit = true;

        const result = getActiveValues ({
            commissionId,
            commissionToEdit,
            description,
            start_date,
            end_date,
            meta_fields,
            rates,
            isActiveEdit
        });
        const expected = {
            active_description: description,
            active_start_date: start_date,
            active_end_date: end_date,
            active_meta_fields: meta_fields,
            active_rates: rates,
            has_active_meta_field_values: true
        };

        expect(result.active_description).to.equal(expected.active_description);
        expect(result.active_start_date.toISOString()).to.equal(expected.active_start_date.toISOString());
        expect(result.active_end_date).to.equal(expected.active_end_date);
        expect(result.active_meta_fields).to.deep.equal(expected.active_meta_fields);
        expect(result.active_rates).to.deep.equal(expected.active_rates);
        expect(result.has_active_meta_field_values).to.equal(expected.has_active_meta_field_values);
    }
);

it('Create helpers checkEditIsUnchanged returns true when the edited commission is unchanged', () => {
    const commission = {
        'description': 'Commission',
        'start_date': '2019-09-23T11:49:37.000Z',
        'end_date': null,
        'meta_fields': [
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
                'values': [
                    'Sku'
                ]
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
        ],
        'rates': [
            {
                'id': '300451',
                'performance_value': 1,
                'performance_model': 'fixed_cpa',
                'type': 'publisher'
            },
            {
                'id': '300472',
                'performance_value': 1,
                'performance_model': 'fixed_cpa',
                'type': 'publisher'
            },
            {
                'id': '300659',
                'performance_value': 2,
                'performance_model': 'fixed_cpa',
                'type': 'campaign'
            }
        ]
    };
    const editCommission = {
        'description': 'Commission',
        'start_date': '2019-09-23T11:49:37.000Z',
        'end_date': null,
        'meta_fields': [
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
                'values': [
                    'Sku'
                ]
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
        ],
        'rates': [
            {
                'id': '300451',
                'performance_value': 1,
                'performance_model': 'fixed_cpa',
                'type': 'publisher'
            },
            {
                'id': '300472',
                'performance_value': 1,
                'performance_model': 'fixed_cpa',
                'type': 'publisher'
            },
            {
                'id': '300659',
                'performance_value': 2,
                'performance_model': 'fixed_cpa',
                'type': 'campaign'
            }
        ]
    };

    const result = checkEditIsUnchanged (commission, editCommission);

    expect(result).to.be.true;
});

it('Create helpers checkEditIsUnchanged returns false when the edited commission is changed', () => {
    const commission = {
        'description': 'CommissionEdit',
        'start_date': '2019-09-24T11:49:37.000Z',
        'end_date': '2019-09-25T11:49:37.000Z',
        'meta_fields': [
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
                'values': [
                    'SkuEdit'
                ]
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
        ],
        'rates': [
            {
                'id': '300451',
                'performance_value': 2,
                'performance_model': 'fixed_cpa',
                'type': 'publisher'
            },
            {
                'id': '300472',
                'performance_value': 2,
                'performance_model': 'fixed_cpa',
                'type': 'publisher'
            },
            {
                'id': '300659',
                'performance_value': 3,
                'performance_model': 'fixed_cpa',
                'type': 'campaign'
            }
        ]
    };
    const editCommission = {
        'description': 'Commission',
        'start_date': '2019-09-23T11:49:37.000Z',
        'end_date': null,
        'meta_fields': [
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
                'values': [
                    'Sku'
                ]
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
        ],
        'rates': [
            {
                'id': '300451',
                'performance_value': 1,
                'performance_model': 'fixed_cpa',
                'type': 'publisher'
            },
            {
                'id': '300472',
                'performance_value': 1,
                'performance_model': 'fixed_cpa',
                'type': 'publisher'
            },
            {
                'id': '300659',
                'performance_value': 2,
                'performance_model': 'fixed_cpa',
                'type': 'campaign'
            }
        ]
    };

    const result = checkEditIsUnchanged (commission, editCommission);

    expect(result).to.be.false;
});


it('Create helpers checkEditIsUnchanged returns true when a commission or edit commission are not supplied', () => {
    const commission = null;
    const editCommission = null;

    const result = checkEditIsUnchanged (commission, editCommission);

    expect(result).to.be.true;
});

it('processSaveErrors handles save errors correctly', () => {
    const errors = [{
        property: 'rates[0].performance_value',
        message: 'rates[0] error'
    }, {
        property: 'rates[1].performance_value',
        message: 'rates[1] error'
    }, {
        property: 'description',
        message: 'description error'
    }, {
        property: 'unknown_prop',
        message: 'unknown_prop error'
    }, {
        message: 'no prop error'
    }];
    const res = processSaveErrors(errors, [{
        id: '5',
        type: 'group'
    }, {
        id: '55',
        type: 'publisher'
    }]);

    expect(errors[0].property).to.equal('rates[group-5].performance_value');
    expect(errors[1].property).to.equal('rates[publisher-55].performance_value');
    expect(res).to.deep.equal({
        firstErrPageInd: 0, // the Description field is on a page before the rate error
        errorsToAlert: [
            'unknown_prop error',   // the error for unknown_prop can't be matched to a field so must be alerted
            'no prop error' // an error with no property specified must be alerted too
        ]
    });
});

