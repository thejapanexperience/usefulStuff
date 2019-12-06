// @flow

import React from 'react';
import { translate as l } from 'app/utils';
import withFieldWrapper from '@phg/stilo-toolbox/v2/hoc/withFieldWrapper';
import { Input, InputSelect, Dropdown } from '@phg/stilo-toolbox/v2/component';
import withHelpIconWrapper from '@phg/stilo-toolbox/v2/hoc/withTooltipHelpIcon';
import { performanceModelsListArray } from './defaults';
import {
    getPerformanceValueLabel,
    getInputSelectOptions,
    getSortedPartners,
    checkPerformanceValueFormat,
    checkCookiePeriodFormat
} from './helpers';

const Span = () => <span className="helpSpan"/>;

const WrappedInput = withFieldWrapper(Input);
const CookiePeriodTooltip = withHelpIconWrapper(Span);
const WrappedInputSelect = withFieldWrapper(InputSelect);
const WrappedDropdown = withFieldWrapper(Dropdown);

import type { CommissionRatePropTypes } from './types';

type DeleteButtonTypes = {
    onClick: () => void
};

const DeleteButton = ({ onClick }: DeleteButtonTypes) => {
    return (
        <div className='DeleteButton'>
            <div className='DeleteButtonText' onClick={onClick}>{l('Remove')}</div>
        </div>
    );
};



// eslint-disable-next-line complexity
const CommissionRate = ({
    rate,
    onChangeRate,
    onSearchForPublishersAndGroups,
    onRemoveCommissionRule,
    index,
    rates,
    publishers,
    groups,
    partnersMultiSelectIsOpenArray,
    togglePartnersMultiSelect,
    partnersMemo,
    partnersSearchString,
    isNotAllPartners,
    currency,
    isCampaignRate
}: CommissionRatePropTypes) => {
    const { id, performance_value, performance_model, cookie_period } = rate;

    const cookieLabel = `${l('Cookie period')} (${l('optional')})`;
    const performanceValueLabel = getPerformanceValueLabel(performance_model, currency);
    const componentId = `CreateCommissionRate-${index}`;

    let sortedPartners, options;
    if (!isCampaignRate) {
        const isInitialList = partnersMemo.count === 0;
        sortedPartners = getSortedPartners({ publishers, groups, isNotAllPartners, isInitialList });

        const publisherOnlyRates = rates.slice(0, rates.length - 1);

        options = getInputSelectOptions({
            partnersMemo,
            partnersSearchString,
            sortedPartners,
            rates: publisherOnlyRates,
            rate
        });
    }

    const cookiePeriodProps = {
        id: !isCampaignRate ? componentId + '-CookiePeriod' : 'CampaignRate-CookiePeriod',
        className: 'wrappedInput small cookiePeriod secondInput',
        label: cookieLabel,
        value: cookie_period,
        onChange: (event: SyntheticInputEvent<EventTarget>) =>
            onChangeRate({
                value: checkCookiePeriodFormat(event.target.value) ? event.target.value : cookie_period,
                key: 'cookie_period',
                index,
                rates
            }),
        placeholder:l('Days')
    };

    return (
        <div id={componentId} className="addPartners">
            <div className="container1">
                {!isCampaignRate && (
                    <WrappedInputSelect
                        id={componentId + '-PartnersAndGroups'}
                        className='wrappedInput'
                        label={l('Add partners')}
                        options={options}
                        labels={{ inputPlaceholder: l('Partners or Group') }}
                        tagButtonType='main'
                        tags={id}
                        addTag={value =>
                            value.id
                                ? onChangeRate({
                                    value: [...id, value],
                                    key: 'id',
                                    index,
                                    rates
                                })
                                : null
                        }
                        removeTag={value => {
                            return onChangeRate({
                                value: [...id.filter(iD => iD.id !== value.id)],
                                key: 'id',
                                index,
                                rates
                            });
                        }}
                        isOpen={partnersMultiSelectIsOpenArray[index]}
                        setOpen={() => togglePartnersMultiSelect(partnersMultiSelectIsOpenArray, index)}
                        getSearchString={searchString =>
                            onSearchForPublishersAndGroups({
                                searchString,
                                partnersMemo,
                                partnersSearchString,
                                sortedPartners,
                                isNotAllPartners
                            })
                        }
                        clearSearchOnSelect={false}
                    />
                )}

                {isCampaignRate && (
                    <div className='CampaignLabelContainer'>
                        <div className='CampaignLabelText'>{l('Commission rate for all other partners (optional)')}</div>
                    </div>
                )}

                <WrappedDropdown
                    id={!isCampaignRate ? componentId + '-PerformanceModel' : 'CampaignRate-PerformanceModel'}
                    className='wrappedInput small secondInput'
                    label={l('Performance model')}
                    value={performance_model}
                    onSelect={value =>
                        onChangeRate({
                            value,
                            key: 'performance_model',
                            index,
                            rates
                        })
                    }
                >
                    {performanceModelsListArray.map(item => (
                        <Dropdown.Item className='input' key={item.value} value={item.value}>
                            {item.label}
                        </Dropdown.Item>
                    ))}
                </WrappedDropdown>
            </div>

            <div className="container2">
                <WrappedInput
                    id={!isCampaignRate ? componentId + '-PerformanceValue' : 'CampaignRate-PerformanceValue'}
                    className='wrappedInput small secondInput performanceValue'
                    label={performanceValueLabel}
                    value={performance_value}
                    onChange={(event: SyntheticInputEvent<EventTarget>) => {
                        return onChangeRate({
                            value: checkPerformanceValueFormat(event.target.value) ? event.target.value : performance_value,
                            key: 'performance_value',
                            index,
                            rates
                        });
                    }}
                    isOpen={partnersMultiSelectIsOpenArray[index] || false}
                    setOpen={() => togglePartnersMultiSelect(partnersMultiSelectIsOpenArray, index)}
                    getSearchString={searchString =>
                        onSearchForPublishersAndGroups({
                            searchString,
                            partnersMemo,
                            partnersSearchString,
                            sortedPartners,
                            isNotAllPartners
                        })
                    }
                    clearSearchOnSelect={false}
                    placeholder={l('Enter')}
                />

                {
                    index === 0
                        ? (
                            <div className="cookiePeriodContainer">
                                <WrappedInput
                                    {...cookiePeriodProps}
                                />
                                <CookiePeriodTooltip
                                    tooltip={l('If left blank, the cookie period will default to the campaign default cookie period.')}
                                    tooltipPlacement="top"
                                    id="cookiePeriodTooltip"
                                />
                            </div>
                        )
                        : (
                            <div className="cookiePeriodContainer">
                                <WrappedInput
                                    {...cookiePeriodProps}
                                />
                            </div>
                        )
                }

            </div>
            {!isCampaignRate && rates.length > 2 && (
                <DeleteButton onClick={() => onRemoveCommissionRule(rates, partnersMultiSelectIsOpenArray, index)} />
            )}
        </div>
    );
};

export { CommissionRate as default, CommissionRate };
