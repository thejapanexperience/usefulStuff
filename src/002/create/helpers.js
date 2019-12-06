// @flow

import currencies from 'currency-formatter/currencies.json';
import { translate as l } from 'app/utils';
import { defaultRate } from './defaults';

import type {
    RatesType,
    RateType,
    EditRatesType,
    EditRateType,
    FormattedRatesType,
    CommissionObjectType,
    EditCommissionObjectType,
    MetaFieldsType,
    PublishersListType,
    GroupsListType,
    FormattedPublishersListType,
    PartnersMemoType,
    FormattedGroupType,
    FormattedPublisherType,
    FormattedGroupsListType,
    DropdownItemOptionsType
} from './types';

const convertDaysToSeconds = (numberOfDays: number) => {
    const seconds = numberOfDays * 24 * 60 * 60;
    return seconds;
};

const convertSecondsToDays = (numberOfSeconds: number) => {
    const days = numberOfSeconds / 24 / 60 / 60;
    return days;
};

const getCurrencySymbol = (iso: string) => {
    const currency: { symbol: string, [key: string]: string | number } = iso === 'RMB' ? currencies['CNY'] : currencies[iso];
    if (currency) {
        return `${currency.symbol}${iso}`;
    } else {
        return iso;
    }
};

const getPerformanceValueLabel = (performance_model: string, iso?: string) => {
    const content = performance_model === 'percentage_cpa' ? '%' : iso && getCurrencySymbol(iso);

    return content ? `${l('Commission')} ${content}` : l('Commission');
};

type GetSortedPartnersType = {
    publishers: FormattedPublishersListType,
    groups: FormattedGroupsListType,
    isNotAllPartners: boolean,
    isInitialList: boolean
};
const getSortedPartners = ({
    publishers,
    groups,
    isNotAllPartners,
    isInitialList
}: GetSortedPartnersType): Array<FormattedGroupType | FormattedPublisherType> => {
    const sorted = [...publishers, ...groups].sort((a, b) => a.label.localeCompare(b.label));

    const moreToCome
        = isNotAllPartners
        && isInitialList
        && publishers.length
            ? { id: '', label: `${l('Showing top 100 results')}...`, type: 'publisher' }
            : null;

    return moreToCome ? [...sorted, moreToCome] : sorted;
};

type FilterInUseOptionsType = {
    rates: RatesType,
    rate: RateType,
    options: Array<FormattedGroupType | FormattedPublisherType>
};

const filterInUseOptions = ({ rates, rate, options }: FilterInUseOptionsType) => {
    const inUseIds = rates.reduce((array, rate) => {
        return [
            ...array,
            ...rate.id.reduce((arr, id) => {
                return !array.includes(id.id) ? [...arr, id.id.toString()] : arr;
            }, [])
        ];
    }, []);

    const rateIds = rate.id.reduce((arr, id) => {
        return [...arr, id.id.toString()];
    }, []);

    const notInUseInThisRateIds = inUseIds.filter(id => {
        return !rateIds.includes(id.toString());
    });

    const filteredForInUseOptions = options.filter(option => {
        return !notInUseInThisRateIds.includes(option.id.toString());
    });

    return filteredForInUseOptions;
};

type GetInputSelectOptionsType = {
    partnersMemo: PartnersMemoType,
    partnersSearchString: string,
    sortedPartners: Array<FormattedGroupType | FormattedPublisherType>,
    rates: RatesType,
    rate: RateType
};
const getInputSelectOptions = ({
    partnersMemo,
    partnersSearchString,
    sortedPartners,
    rates,
    rate
}: GetInputSelectOptionsType): Array<FormattedGroupType | FormattedPublisherType> => {

    const memoSortedPartnersGroups = partnersMemo.searches[partnersSearchString] || null;

    // prevent janky displaying of last api call results when making new filtered call
    const values = Object.values(partnersMemo.searches).map(value => JSON.stringify(value));
    const isMatch = values.includes(JSON.stringify(sortedPartners));

    let options;
    if (memoSortedPartnersGroups) {
        options = memoSortedPartnersGroups;
    } else {
        options = isMatch ? partnersMemo.searches[''] : sortedPartners;
    }

    const filteredForInUseOptions = filterInUseOptions({ rates, rate, options });

    return filteredForInUseOptions;
};

const checkPerformanceValueFormat = (value: string) => {
    const rgx = /^[0-9]*\.?[0-9]?[0-9]?$/;
    return value.match(rgx);
};

const checkCookiePeriodFormat = (value: string) => {
    const rgx = /^\d+$/;
    return (value.match(rgx) && Number(value) <= 365) || value === '';
};
const checkNameLength = (value: string) => {
    const rgx = /^.{0,300}$/;
    return value.match(rgx);
};

type CheckisNotAllPartnersType = {
    partnersMemo: PartnersMemoType,
    publishersList: PublishersListType
};
const checkisNotAllPartners = ({ partnersMemo, publishersList }: CheckisNotAllPartnersType): boolean => {

    if (partnersMemo.isNotAllPartners) {
        return true;
    }

    return !partnersMemo.searches['']
        ? publishersList && publishersList.limit <= publishersList.count
        : publishersList && publishersList.limit <= partnersMemo.searches[''].length;
};

const getRatesCompletionStatuses = (rates: RatesType): Array<'complete' | 'incomplete' | 'empty'> => {
    // eslint-disable-next-line complexity
    return rates.map((rate, i) => {
        if (i < rates.length - 1) {
            if (rate.id.length && (rate.performance_value || rate.performance_value === 0)) {
                return 'complete';
            } else if (!rate.id.length && rate.performance_value !== 0 && !rate.performance_value) {
                return 'empty';
            } else {
                return 'incomplete';
            }
        } else {
            return rate.performance_value ? 'complete' : 'empty';
        }
    });
};

const formatRatesForApi = (rates: RatesType, campaignId: number | string): FormattedRatesType => {
    // if no id.length then it's the campaign rate
    const multiplePartnersGroupsRates = rates
        .map(rate => {
            return rate.id.length
                ? rate.id.map(id => {
                    return {
                        ...rate,
                        id: [id]
                    };
                })
                : rate;
        })
        .reduce((flat, toFlatten) => flat.concat(toFlatten), []);

    const formattedRates = multiplePartnersGroupsRates.map(rate => {
        const formattedRate = {
            ...rate,
            type: rate.id.length ? rate.id[0].type : 'campaign',
            id: rate.id.length ? rate.id[0].id.toString() : campaignId.toString(),
            cookie_period: rate.cookie_period ? convertDaysToSeconds(rate.cookie_period) : '',
            performance_value: Number(rate.performance_value)
        };
        !formattedRate.cookie_period && delete formattedRate.cookie_period;
        return formattedRate;
    });
    return formattedRates;
};

const returnEmptyMeta = (meta_fields: MetaFieldsType): MetaFieldsType => meta_fields.map(mf => { return { name: mf.name, values: [] };});
const transformMetaFields = (meta_fields: MetaFieldsType): MetaFieldsType => {
    return meta_fields && meta_fields.map(mf => {
        const { name, values } = mf;
        return values.length && !mf.values[0]
            ? { name, values: [] }
            : mf;
    }) || meta_fields;
};

const transformCommissionObjectForApi = (commission: CommissionObjectType, campaignId: number | string, noMeta: boolean) => {
    const transformed = {
        description: commission.description,
        start_date: commission.start_date && commission.start_date.toISOString(),
        end_date: commission.end_date ? commission.end_date.toISOString() : null,
        meta_fields: noMeta ? returnEmptyMeta(commission.meta_fields) : transformMetaFields(commission.meta_fields),
        rates: formatRatesForApi(commission.rates, campaignId),
        commission_based_on_field: commission.commission_based_on_field
    };
    return transformed;
};

const transformPublishersForMultiSelect = (publishers: PublishersListType): FormattedPublishersListType => {
    return publishers.publishers.map(({ publisher }) => {
        return {
            id: publisher.publisher_id.toString(),
            label: publisher.account_name,
            type: 'publisher'
        };
    });
};

const transformGroupsForMultiSelect = (groups: GroupsListType): FormattedGroupsListType => {
    return groups.map(({ commission_group }) => {
        return {
            id: commission_group.commission_group_id.toString(),
            label: commission_group.name,
            type: 'group'
        };
    });
};

// If there is an underscore, replace with space. Always capitalise first letter.
const formatCustomMetaFieldName = (fieldName: string) => {
    if (fieldName.includes('_')) {
        const formattedString = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
        return formattedString.replace(/_/g, ' ');
    }
    return `${fieldName.charAt(0).toUpperCase()}${fieldName.substr(1)}`;
};

const getDropdownItems = ({ key, dropdownItemOptions }: { key: string, dropdownItemOptions: DropdownItemOptionsType }) => {
    const { countries, verticals, conversionTypes, customerTypes } = dropdownItemOptions;
    let dropdownItems = [];
    switch (key) {
        case 'country':
            dropdownItems = [
                { value: '', label: l('All') },
                ...countries
                    .sort((a, b) => a.printable_name.localeCompare(b.printable_name))
                    .map(country => {
                        return { value: country.iso, label: country.printable_name };
                    })
            ];
            break;

        case 'conversion_type':
            dropdownItems = [
                { value: '', label: l('All') },
                ...conversionTypes.map(conversionType => {
                    return {
                        value: conversionType.conversion_type_id.toString(),
                        label: conversionType.description
                    };
                })
            ];
            break;

        case 'customer_type':
            dropdownItems = [
                { value: '', label: l('All') },
                ...Object.keys(customerTypes).map(customerType => {
                    return {
                        value: customerType,
                        label: customerTypes[customerType]
                    };
                })
            ];
            break;

        case 'vertical':
            dropdownItems = [
                { value: '', label: l('All') },
                ...verticals
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(vertical => {
                        return {
                            value: vertical.vertical_id.toString(),
                            label: vertical.name
                        };
                    })
            ];
            break;

        default:
            break;
    }
    return dropdownItems;
};

const getRate = (rate) => {
    return {
        id: [{
            id: rate.id,
            label: rate.name,
            type: rate.type
        }],
        performance_value: rate.performance_value,
        performance_model: rate.performance_model,
        cookie_period: rate.cookie_period && convertSecondsToDays(rate.cookie_period) || '',
    };
};
const getGroupedRates = (rates: EditRatesType ) => {
    const init = { rates: [], campaignRate: defaultRate };
    // eslint-disable-next-line complexity, flowtype/no-weak-types
    const grouped = rates.reduce((obj: any, rate: EditRateType) => {
        if (rate.type === 'campaign') {
            return {
                ...obj,
                campaignRate: {
                    id: [],
                    performance_value: rate.performance_value,
                    performance_model: rate.performance_model,
                    cookie_period: rate.cookie_period ? convertSecondsToDays(rate.cookie_period) : '',
                }
            };
        }

        if (!obj.rates.length) {
            return {
                ...obj,
                rates: [getRate(rate)]
            };
        }

        for (let i = 0; i <= obj.rates.length; i++) {
            if ( i === obj.rates.length) {
                return {
                    ...obj,
                    rates: [...obj.rates, getRate(rate)]
                };
            }

            if ( obj.rates[i].performance_value === rate.performance_value
                    && obj.rates[i].performance_model === rate.performance_model
                    && ((rate.cookie_period && obj.rates[i].cookie_period === convertSecondsToDays(rate.cookie_period))
                        || (!obj.rates[i].cookie_period && !rate.cookie_period))
            ) {
                obj.rates[i].id.push(
                    {
                        id: rate.id,
                        label: rate.name,
                        type: rate.type
                    }
                );
                return {
                    ...obj,
                    rates: obj.rates
                };
            }
        }

    }, init);


    const sortedRates = grouped && grouped.rates.length && grouped.rates.map(rate => {
        return {
            ...rate,
            id: rate.id.sort((a,b) => a.label.localeCompare(b.label))
        };
    }).sort((a,b) => a.performance_value - b.performance_value) || [defaultRate];

    const campaignRate = grouped ? grouped.campaignRate : defaultRate;

    return [...sortedRates, campaignRate];
};

const mergeMetaWithEditMeta = (meta_fields: MetaFieldsType, edit_meta_fields: MetaFieldsType): MetaFieldsType => {
    return meta_fields.map(mf => {
        const matches = edit_meta_fields.filter((edit_mf) => edit_mf.name === mf.name);
        if (matches.length) {
            return matches[0];
        } else {
            return {
                name: mf.name, values: []
            };
        }
    });
};

const checkHasMetaValues = (meta_fields: MetaFieldsType): boolean => {
    const filteredForValues = meta_fields.filter(mf => mf.values.length);
    return filteredForValues.length > 0;
};

type FormattedCommissionType = {
    description: string,
    start_date: Date | string | null,
    end_date: Date | string | null,
    meta_fields: MetaFieldsType,
    rates: FormattedRatesType,
    commission_based_on_field?: string
};
//eslint-disable-next-line complexity
const checkEditIsUnchanged = (commission: FormattedCommissionType, editCommission: EditCommissionObjectType | null) => {

    if (commission && editCommission) {
        const { description, start_date, end_date, meta_fields, rates, commission_based_on_field } = commission;
        const {
            description: edit_description,
            start_date: edit_start_date,
            end_date: edit_end_date,
            meta_fields: edit_meta_fields,
            rates: edit_rates,
            commission_based_on_field: edit_commission_based_on_field
        } = editCommission;

        const compare_description = description && edit_description && description === edit_description;
        const compare_start_date = start_date && edit_start_date
            && new Date(start_date).toISOString() === new Date(edit_start_date).toISOString();
        const compare_end_date = (
            end_date && edit_end_date && new Date(end_date).toISOString() === new Date(edit_end_date).toISOString()
        ) || !end_date && !edit_end_date ? true : false;
        const compare_meta_fields = JSON.stringify(meta_fields)
        === JSON.stringify(mergeMetaWithEditMeta(meta_fields, edit_meta_fields));
        const compare_rates = edit_rates.length === rates.length
        && edit_rates.reduce( (bool, {
            cookie_period,
            id,
            performance_model,
            performance_value,
            type
        }, i ) => {
            const isSame = rates[i]
                && (cookie_period === rates[i].cookie_period
                || !cookie_period && !rates[i].cookie_period)
                && id === rates[i].id
                && performance_model === rates[i].performance_model
                && performance_value === rates[i].performance_value
                && type === rates[i].type;
            return bool && isSame;
        }, true);
        const compare_commission_based_on_field = commission_based_on_field && edit_commission_based_on_field
            && commission_based_on_field === edit_commission_based_on_field
            || !commission_based_on_field && !edit_commission_based_on_field;
        return compare_description && compare_start_date && compare_end_date && compare_meta_fields && compare_rates
            && compare_commission_based_on_field ? true : false;
    }

    return true;

};

type GetActiveValuesType = {
    commissionId?: string | number,
    commissionToEdit?: EditCommissionObjectType,
    description: string,
    start_date: Date | null,
    end_date: Date | null,
    meta_fields: MetaFieldsType,
    rates: RatesType,
    isActiveEdit: boolean,
    commission_based_on_field: string
};
// eslint-disable-next-line complexity
const getActiveValues = ({
    commissionId,
    commissionToEdit,
    description,
    start_date,
    end_date,
    meta_fields,
    rates,
    isActiveEdit,
    commission_based_on_field
}: GetActiveValuesType) => {
    const active_description = commissionId && commissionToEdit && !isActiveEdit && commissionToEdit.description
        ? commissionToEdit.description
        : description;

    const active_start_date = commissionId && commissionToEdit && !isActiveEdit && commissionToEdit.start_date
        ? new Date(commissionToEdit.start_date)
        : start_date;

    const active_end_date = commissionId && commissionToEdit && !isActiveEdit && commissionToEdit.end_date
        ? new Date(commissionToEdit.end_date)
        : end_date;

    const active_meta_fields = commissionId && commissionToEdit && !isActiveEdit && commissionToEdit.meta_fields.length
        ? mergeMetaWithEditMeta(meta_fields, commissionToEdit.meta_fields)
        : meta_fields;

    const active_rates = commissionId && commissionToEdit && !isActiveEdit && commissionToEdit.rates.length
        ? getGroupedRates(commissionToEdit.rates)
        : rates;

    const active_commission_based_on_field = commissionId && commissionToEdit && !isActiveEdit && commissionToEdit.commission_based_on_field
        ? commissionToEdit.commission_based_on_field
        : commission_based_on_field;

    return {
        active_description,
        active_start_date,
        active_end_date,
        active_meta_fields,
        has_active_meta_field_values: checkHasMetaValues(active_meta_fields),
        active_rates,
        active_commission_based_on_field
    };
};

const checkIsPage3SaveButtonEnabled = (rates: RatesType): boolean => {
    const ratesStatuses = getRatesCompletionStatuses(rates);
    return ratesStatuses.some(status => status === 'incomplete') || ratesStatuses.every(status => status === 'empty') ? false : true;
};

type IsNextButtonDisabledTypes = {
    pageNumber: string,
    description: string,
    start_date: Date | null,
    rates: RatesType,
    rates: RatesType
};
const isNextButtonDisabled = ({ pageNumber, description, start_date, rates }: IsNextButtonDisabledTypes) => {
    let nextButtonIsDisabled = true;
    if (pageNumber === '1' && description && start_date) {
        nextButtonIsDisabled = false;
    } else if (pageNumber === '2') {
        nextButtonIsDisabled = false;
    } else if (pageNumber === '3' && rates.length && checkIsPage3SaveButtonEnabled(rates)) {
        nextButtonIsDisabled = false;
    }

    return nextButtonIsDisabled;
};

/**
 * Processes the response data of a commission save call.
 * Rate errors come back with indexes from the list they have been sent and with no indication of which publisher (or the campaign)
 * they relate to. This function modifies the errors in the response to replace the indexes with ids for easier matching.
 * @param   {Object}    errors  The list of errors from the API
 * @param   {Array} rates   The list of rates sent to the API
 * @returns {Object}    The errors that need to be alerted to the user (that can't be matched to a field in the dialog) and the index
 *                      of the first page of the dialog where and error was indentified.
 */
const processSaveErrors = (errors: Array<{property: string, message: string}>, rates: FormattedRatesType) => {
    // keep a list of which fields can be found on which pages
    const pageFields = [
        // page 1
        ['description', 'start_date', 'end_date'],
        // page2
        [
            field => field.indexOf('meta_fields[') == 0 // if it's a meta fields error. use .startsWith() when IE is no longer supported.
        ],
        // page3
        [
            field => field.indexOf('rates[') == 0 // if it's a rates error. use .startsWith() when IE is no longer supported.
        ]
    ];
    // returns the index of the page that includes this field
    const findPageInd = field => pageFields.findIndex( pageFields => pageFields.some( pageField => {
        // if it's a function call it with the field. otherwise compare directly.
        return typeof pageField == 'function' ? pageField(field) : pageField == field;
    }) );

    let firstErrPageInd = -1;
    const errorsToAlert = [];

    // eslint-disable-next-line complexity
    errors.forEach( err => {
        if (err.property) {  // must be a validation error on a field
            const pageInd = findPageInd(err.property);
            if (pageInd > -1) {  // if a page was found
                if (firstErrPageInd == -1 || firstErrPageInd > pageInd)   // and it precedes the last one found
                    firstErrPageInd = pageInd;
            } else  // otherwise "alert" the error
                errorsToAlert.push(err.message);

            // see if this may be a rate error
            const re = /^rates\[(\d+)\]/;
            const rateMatch = err.property.match(re);
            if (rateMatch) {
                const rate = rates[Number(rateMatch[1])];   // the rate that has been sent
                const errId = rate.type == 'campaign' ? 'campaign' : `${rate.type}-${rate.id.toString()}`;
                err.property = err.property.replace(re, `rates[${errId}]`);  // make it like "rates[publisher-3].xxx"
            }
        } else      // some general error. "alert" that
            errorsToAlert.push(err.message);
    });

    return {
        firstErrPageInd,
        errorsToAlert
    };
};

export {
    transformCommissionObjectForApi,
    transformPublishersForMultiSelect,
    transformGroupsForMultiSelect,
    formatCustomMetaFieldName,
    getDropdownItems,
    getPerformanceValueLabel,
    getInputSelectOptions,
    getSortedPartners,
    getRatesCompletionStatuses,
    getGroupedRates,
    getActiveValues,
    checkPerformanceValueFormat,
    checkCookiePeriodFormat,
    checkNameLength,
    checkisNotAllPartners,
    checkIsPage3SaveButtonEnabled,
    checkEditIsUnchanged,
    convertDaysToSeconds,
    convertSecondsToDays,
    isNextButtonDisabled,
    processSaveErrors
};
