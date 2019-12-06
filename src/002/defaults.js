import { translate as l } from 'app/utils';

const customerTypesListObject = {
    new: 'New',
    existing: 'Existing'
};

const performanceModelsListArray = [
    { value: 'fixed_cpa', label: l('Fixed CPA') },
    { value: 'percentage_cpa', label: `% ${l('CPA')}` },
    { value: 'cpc', label: l('CPC') }
];

const pageTitlesListObject = {
    '1': 'Configure',
    '2': 'Options',
    '3': 'Partner rates'
};

const defaultRate = {
    id: [],
    performance_value: '',
    performance_model: 'fixed_cpa',
    cookie_period: ''
};

const commissionRate = {
    id: [],
    performance_value: '',
    performance_model: 'fixed_cpa',
    cookie_period: ''
};

const metaFieldsReference = {
    conversion_type: { label: 'Conversion type', inputType: 'Dropdown' },
    customer_reference: { label: 'Customer reference', inputType: 'Input' },
    advertiser_reference: { label: 'Adref', inputType: 'Input' },
    country: { label: 'Country', inputType: 'Dropdown' },
    vertical: { label: 'Vertical', inputType: 'Dropdown' },
    sku: { label: 'SKU', inputType: 'Input' },
    cookie_status: { label: 'Cookie status', inputType: 'Input' },
    category: { label: 'Category', inputType: 'Input' },
    customer_type: { label: 'Customer type', inputType: 'Dropdown' }
};

const fromDatePickerStrings = {
    save: l('Apply'),
    cancel: l('Cancel'),
    triggerDefault: `${l('Choose')}...`,
    invalidMessage: `${l('Sorry, invalid date')}...`,
    timePickerPlaceholder: `${l('Choose')}...`
};

const toDatePickerStrings = {
    ...fromDatePickerStrings,
    reset: l('Remove'),
    invalidMessage: `${l('Must be after the "from" date')}...`
};

const datePickerStrings = {
    from: fromDatePickerStrings,
    to: toDatePickerStrings
};

export {
    customerTypesListObject,
    pageTitlesListObject,
    performanceModelsListArray,
    metaFieldsReference,
    defaultRate,
    commissionRate,
    datePickerStrings
};
