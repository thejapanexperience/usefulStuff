// @flow

import React from 'react';
import { Link } from '@phg/stilo-toolbox/v2/component';
import FormFeedback from '@phg/stilo-toolbox/v2/component/FormFeedback';
import { translate as l } from 'app/utils';
import { transformPublishersForMultiSelect, transformGroupsForMultiSelect, checkisNotAllPartners } from './helpers';
import CommissionRate from './CommissionRate';

import type { PageThreePropTypes } from './types';

type AddMoreTypes = {
    onAddCommissionRule: () => void,
    disabled: boolean
};

const AddMore = ({ onAddCommissionRule, disabled }: AddMoreTypes) => {
    return (
        <div id='PageThreeAddMore' className='AddMore'>
            <Link id='CreateNextStepLink' disabled={disabled} onClick={onAddCommissionRule}>
                {l('Add more')} +
            </Link>
        </div>
    );
};

const PageThree = ({
    className,
    togglePartnersMultiSelect,
    partnersMultiSelectIsOpenArray,
    partnersMemo,
    partnersSearchString,

    onChangeRate,
    onSearchForPublishersAndGroups,
    onAddCommissionRule,
    onRemoveCommissionRule,

    rates,

    errors,

    publishersList,
    groupsList,
    currency,
    campaignDefaultCookiePeriod
}: PageThreePropTypes) => {
    const publishers = !publishersList ? [] : transformPublishersForMultiSelect(publishersList);
    const groups = !groupsList ? [] : transformGroupsForMultiSelect(groupsList);
    const isNotAllPartners = checkisNotAllPartners({ partnersMemo, publishersList });

    let isAddMoreDisabled = true;
    if (
        rates.length
        && rates[rates.length - 2].id.length
        && (rates[rates.length - 2].performance_value
        || rates[rates.length - 2].performance_value === 0)
    ) {
        isAddMoreDisabled = false;
    }

    return (
        <div id='CreatePageThree' className={className}>
            <div className='rowsContainer'>
                <div className="rows">
                    {rates.map((rate, index) => {
                        const isCampaignRate = index === rates.length - 1;
                        let err;
                        if (isCampaignRate)
                            err = errors['rates[campaign]'];
                        else {
                            const errId = rate.id.find( id => errors[`rates[${id.type}-${id.id}]`] );
                            if (errId)
                                err = errors[`rates[${errId.type}-${errId.id}]`];
                        }

                        return (
                            <div className={`rowContainer${isCampaignRate ? ' isCampaignRate' : ''}`} key={index}>
                                <CommissionRate
                                    index={index}
                                    rate={rate}
                                    onChangeRate={onChangeRate}
                                    onSearchForPublishersAndGroups={onSearchForPublishersAndGroups}
                                    onRemoveCommissionRule={onRemoveCommissionRule}
                                    rates={rates}
                                    publishers={publishers}
                                    groups={groups}
                                    togglePartnersMultiSelect={togglePartnersMultiSelect}
                                    partnersMultiSelectIsOpenArray={partnersMultiSelectIsOpenArray}
                                    partnersMemo={partnersMemo}
                                    partnersSearchString={partnersSearchString}
                                    isNotAllPartners={isNotAllPartners}
                                    currency={currency}
                                    campaignDefaultCookiePeriod={campaignDefaultCookiePeriod}
                                    isCampaignRate={isCampaignRate}
                                />
                                { err &&
                                    <FormFeedback
                                        kind="error"
                                        className="RateError"
                                    >
                                        {err}
                                    </FormFeedback> }
                                {index === rates.length - 2 && (
                                    <AddMore
                                        onAddCommissionRule={() => onAddCommissionRule(rates, partnersMultiSelectIsOpenArray)}
                                        disabled={isAddMoreDisabled}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export { PageThree as default, PageThree };
