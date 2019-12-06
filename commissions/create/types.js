// @flow

// import type { Record } from 'immutable';
import type { Dispatch } from 'redux';
import type { GlobalStateType } from 'app/state/globalStateType';

type RateTypeTypes = 'campaign' | 'publisher' | 'group';

type RateType = {
    id: Array<{ id: string | number | '', label: string, type: RateTypeTypes }>,
    performance_value: number | '',
    performance_model: 'fixed_cpa' | 'percentage_cpa' | 'cpc',
    cookie_period: number | ''
};
type RatesType = Array<RateType>;
type EditRateType = {
    cookie_period: number | null,
    id: string,
    name: string,
    performance_model: 'fixed_cpa' | 'percentage_cpa' | 'cpc',
    performance_value: number,
    type: 'publisher' | 'group' | 'campaign'
};
type EditRatesType = Array<EditRateType>;
type FormattedRateType = {
    id: Array<{ id: string | number | '', label: string, type: RateTypeTypes }> | string,
    type: RateTypeTypes,
    performance_value: number | '',
    performance_model: 'fixed_cpa' | 'percentage_cpa' | 'cpc',
    cookie_period?: number | ''
};
type FormattedRatesType = Array<FormattedRateType>;

type MetaFieldType = {
    values: Array<string | number>,
    name: string
};
type MetaFieldsType = Array<MetaFieldType>;

type VerticalType = {
    vertical_id: number,
    name: string
};
type VerticalsType = Array<VerticalType>;

type CountryType = { iso: string, printable_name: string, [key: string]: string };
type CountriesType = Array<CountryType>;

type CurrencyType = string;

type CustomerTypesType = {
    new: 'New',
    existing: 'Existing'
};

type ConversionType = {
    conversion_type_id: string,
    conversion_type: string,
    description: string,
    [key: string]: string
};
type ConversionTypesType = Array<ConversionType>;

type PublisherType = {
    publisher: {
        publisher_id: number,
        account_name: string,
        [key: string]: any // eslint-disable-line flowtype/no-weak-types
    }
};
type PublishersType = Array<PublisherType>;
type PublishersListType = {
    publishers: PublishersType,
    count: number,
    limit: number,
    [key: string]: string | number
};
type FormattedPublisherType = { id: number | string, label: string, type: 'publisher' };
type FormattedPublishersListType = Array<FormattedPublisherType>;

type GroupType = {
    commission_group: {
        commission_group_id: string,
        name: string,
        publishers: PublishersType,
        [key: string]: string | number
    }
};
type GroupsListType = Array<GroupType>;
type FormattedGroupType = { id: number | string, label: string, type: 'group' };
type FormattedGroupsListType = Array<FormattedGroupType>;

type CommissionObjectType = {
    description: string,
    start_date: Date | null,
    end_date: Date | null,
    meta_fields: Array<MetaFieldType>,
    rates: RatesType,
    has_active_meta_field_values?: boolean,
    commission_based_on_field: string
};

type EditCommissionObjectType = {
    description: string,
    start_date: Date | null,
    end_date: Date | null,
    meta_fields: Array<MetaFieldType>,
    rates: EditRatesType,
    id: string,
    status: string,
    commission_based_on_field: string
};

type DropdownItemOptionsType = {
    countries: CountriesType,
    verticals: VerticalsType,
    conversionTypes: ConversionTypesType,
    customerTypes: CustomerTypesType
};

type PartnersMemoType = {
    searches: {
        [key: string]: Array<FormattedGroupType | FormattedPublisherType>
    },
    isNotAllPartners?: boolean,
    count: number
};

// other types
type PageNumberType = string;
type MetaFieldsToggleType = number;
type StartDatePickerIsOpenType = boolean;
type EndDatePickerIsOpenType = boolean;
type PartnersMultiSelectIsOpenArrayType = Array<boolean>;
type PublisherIdType = string;
type DescriptionType = string;
type StartDateType = Date | null;
type EndDateType = Date | null;
type CampaignDefaultCurrencyType = string;
type CampaignDefaultCookiePeriodType = number;

// function types
type ToggleStartDatePickerType = boolean => void;
type ToggleEndDatePickerType = boolean => void;
type TogglePartnersMultiSelectType = (Array<boolean>, number) => void;
type OnChangeType = (string | number | Date, string) => void;
type OnChangeMetaFieldType = (string | number) => void;
type OnChangeMetaFieldsType = (string | number, string, MetaFieldsType) => void;
type OnChangeRateType = ({
    value: string | number | Array<string | number | { id: string | number, label: string }>,
    key: string,
    index: number,
    rates: RatesType
}) => void;
type OnSaveType = ({
    commissionObject: CommissionObjectType,
    campaignId: string | number,
    commissionId: string | number | null,
    commissionToEdit: EditCommissionObjectType | null,
    noMeta: boolean
    }) => void;
type OnContinueType = string => void;
type OnGoBackType = string => void;
type OnCancelType = () => void;
type OnSearchForPublishersAndGroupsType = ({
    searchString: string,
    partnersMemo: PartnersMemoType,
    partnersSearchString: string,
    sortedPartners: Array<FormattedGroupType | FormattedPublisherType>,
    isNotAllPartners: boolean
}) => void;
type OnAddCommissionRuleType = (RatesType, PartnersMultiSelectIsOpenArrayType) => void;
type OnRemoveCommissionRuleType = (RatesType, PartnersMultiSelectIsOpenArrayType, number) => void;
type OnSetEditDataType = (CommissionObjectType) => void;

type StateType = GlobalStateType;
type DispatchType = Dispatch<*>;

type CreateCommissionMDTPTypes = {
    onMountLoadAction: ({commissionId: string}) => void,
    onChange: OnChangeType,
    onChangeMetaFields: OnChangeMetaFieldsType,
    onChangeRate: OnChangeRateType,
    onSave: OnSaveType,
    onContinue: OnContinueType,
    onGoBack: OnGoBackType,
    onCancel: OnCancelType,
    onSearchForPublishersAndGroups: OnSearchForPublishersAndGroupsType,
    onAddCommissionRule: OnAddCommissionRuleType,
    onRemoveCommissionRule: OnRemoveCommissionRuleType,
    onSetEditData: OnSetEditDataType,
    toggleStartDatePicker: ToggleStartDatePickerType,
    toggleEndDatePicker: ToggleEndDatePickerType,
    togglePartnersMultiSelect: TogglePartnersMultiSelectType
};

type CreateCommissionIndexPropTypes = {
    pageNumber: PageNumberType,
    metaFieldsToggle: MetaFieldsToggleType,
    startDatePickerIsOpen: StartDatePickerIsOpenType,
    toggleStartDatePicker: ToggleStartDatePickerType,
    endDatePickerIsOpen: EndDatePickerIsOpenType,
    toggleEndDatePicker: ToggleEndDatePickerType,
    partnersMultiSelectIsOpenArray: PartnersMultiSelectIsOpenArrayType,
    publisherId: PublisherIdType,
    togglePartnersMultiSelect: TogglePartnersMultiSelectType,
    partnersSearchString: string,
    isActiveEdit: boolean,
    onChange: OnChangeType,
    onChangeMetaFields: OnChangeMetaFieldsType,
    onChangeRate: OnChangeRateType,
    onSave: OnSaveType,
    onContinue: OnContinueType,
    onGoBack: OnGoBackType,
    onCancel: OnCancelType,
    onSearchForPublishersAndGroups: OnSearchForPublishersAndGroupsType,
    onAddCommissionRule: OnAddCommissionRuleType,
    onRemoveCommissionRule: OnRemoveCommissionRuleType,
    onSetEditData: OnSetEditDataType,
    description: DescriptionType,
    start_date: StartDateType,
    end_date: EndDateType,
    meta_fields: MetaFieldsType,
    rates: RatesType,
    commissionObject: CommissionObjectType,
    commissionId?: string | number,
    commissionToEdit?: EditCommissionObjectType | typeof undefined,
    verticals: VerticalsType,
    countries: CountriesType,
    campaignDefaultCurrency: CampaignDefaultCurrencyType,
    campaignDefaultCookiePeriod: CampaignDefaultCookiePeriodType,
    campaignId: string | number,
    conversionTypes: ConversionTypesType,
    publishersList: PublishersListType,
    groupsList: GroupsListType
};
type CreateCommissionPropTypes = {
    classes: {
        ZShape: string,
        Context: string,
        Main: string,
        DialoguePages: string
    },
    pageNumber: PageNumberType,
    metaFieldsToggle: MetaFieldsToggleType,
    startDatePickerIsOpen: StartDatePickerIsOpenType,
    toggleStartDatePicker: ToggleStartDatePickerType,
    endDatePickerIsOpen: EndDatePickerIsOpenType,
    toggleEndDatePicker: ToggleEndDatePickerType,
    partnersMultiSelectIsOpenArray: PartnersMultiSelectIsOpenArrayType,
    partnersMemo: PartnersMemoType,
    partnersSearchString: string,
    isActiveEdit: boolean,
    publisherId: PublisherIdType,
    togglePartnersMultiSelect: TogglePartnersMultiSelectType,
    onChange: OnChangeType,
    onChangeMetaFields: OnChangeMetaFieldsType,
    onChangeRate: OnChangeRateType,
    onSave: OnSaveType,
    onContinue: OnContinueType,
    onGoBack: OnGoBackType,
    onCancel: OnCancelType,
    onSearchForPublishersAndGroups: OnSearchForPublishersAndGroupsType,
    onAddCommissionRule: OnAddCommissionRuleType,
    onRemoveCommissionRule: OnRemoveCommissionRuleType,
    onSetEditData: OnSetEditDataType,
    description: DescriptionType,
    start_date: StartDateType,
    end_date: EndDateType,
    meta_fields: MetaFieldsType,
    rates: RatesType,
    errors: {},
    commissionId?: string | number,
    commissionToEdit?: EditCommissionObjectType | typeof undefined,
    verticals: VerticalsType,
    countries: CountriesType,
    campaignDefaultCurrency: CampaignDefaultCurrencyType,
    campaignDefaultCookiePeriod: CampaignDefaultCookiePeriodType,
    campaignId: string | number,
    conversionTypes: ConversionTypesType,
    publishersList: PublishersListType,
    groupsList: GroupsListType,
    campaign: {[key: string]: *},
    commissionByMetaSettings: ?{ field: string, label: string},
    commission_based_on_field: string
};

type PageOnePropTypes = {
    className: string,
    toggleStartDatePicker: ToggleStartDatePickerType,
    toggleEndDatePicker: ToggleEndDatePickerType,
    startDatePickerIsOpen: StartDatePickerIsOpenType,
    endDatePickerIsOpen: EndDatePickerIsOpenType,
    fromDatePickerIsDisabled: boolean,

    onChange: OnChangeType,
    campaign: {[key: string]: *},

    description: DescriptionType,
    start_date: StartDateType,
    end_date: EndDateType,
    commission_based_on_field: string,
    commissionByMetaSettings: ?{ field: string, label: string},

    errors: { [key: string]: * }
};

type PageTwoPropTypes = {
    className: string,
    metaFieldsToggle: MetaFieldsToggleType,

    onChange: OnChangeType,
    onChangeMetaFields: OnChangeMetaFieldsType,

    meta_fields: MetaFieldsType,

    countries: CountriesType,
    verticals: VerticalsType,
    conversionTypes: ConversionTypesType,
    customerTypes: CustomerTypesType,

    errors: {}

};

type MetaFieldsPropTypes = {
    onChangeMetaFields: OnChangeMetaFieldsType,
    meta_fields: MetaFieldsType,
    dropdownItemOptions: DropdownItemOptionsType,
    errors: {}
};

type MetaInputType = {
    key: string,
    label: string,
    values: Array<string | number>,
    onChangeMetaField: OnChangeMetaFieldType,
    error?: string
};
type MetaDropdownType = {
    key: string,
    label: string,
    values: Array<string | number>,
    onChangeMetaField: OnChangeMetaFieldType,
    dropdownItemOptions: DropdownItemOptionsType,
    error?: string
};

type PageThreePropTypes = {
    className: string,
    togglePartnersMultiSelect: TogglePartnersMultiSelectType,
    partnersMultiSelectIsOpenArray: PartnersMultiSelectIsOpenArrayType,
    partnersMemo: PartnersMemoType,
    partnersSearchString: string,

    onChangeRate: OnChangeRateType,
    onSearchForPublishersAndGroups: OnSearchForPublishersAndGroupsType,
    onAddCommissionRule: OnAddCommissionRuleType,
    onRemoveCommissionRule: OnRemoveCommissionRuleType,

    rates: RatesType,

    errors: {[key: string]: string},

    publishersList: PublishersListType,
    groupsList: GroupsListType,
    currency: CurrencyType,
    campaignDefaultCookiePeriod: CampaignDefaultCookiePeriodType
};

type CommissionRatePropTypes = {
    rate: RateType,
    onChangeRate: OnChangeRateType,
    onSearchForPublishersAndGroups: OnSearchForPublishersAndGroupsType,
    onRemoveCommissionRule: OnRemoveCommissionRuleType,
    index: number,
    rates: RatesType,
    publishers: FormattedPublishersListType,
    groups: FormattedGroupsListType,
    partnersMultiSelectIsOpenArray: PartnersMultiSelectIsOpenArrayType,
    togglePartnersMultiSelect: TogglePartnersMultiSelectType,
    partnersMemo: PartnersMemoType,
    partnersSearchString: string,
    isNotAllPartners: boolean,
    currency: CurrencyType,
    campaignDefaultCookiePeriod: CampaignDefaultCookiePeriodType,
    isCampaignRate: boolean
};

type NextStepPropTypes = {
    onClick: OnContinueType | OnSaveType,
    onCancel: OnCancelType,
    buttonText: string,
    disabled: boolean
};

type PreviousStepPropTypes = {
    onGoBack: OnGoBackType
};

export type {
    RatesType,
    RateType,
    EditRatesType,
    EditRateType,
    FormattedRatesType,
    FormattedRateType,
    MetaFieldsType,
    CommissionObjectType,
    EditCommissionObjectType,
    PublishersListType,
    GroupsListType,
    FormattedPublishersListType,
    FormattedGroupsListType,
    DropdownItemOptionsType,
    PartnersMemoType,
    FormattedGroupType,
    FormattedPublisherType,
    StateType,
    DispatchType,
    CreateCommissionIndexPropTypes,
    CreateCommissionMDTPTypes,
    CreateCommissionPropTypes,
    PageOnePropTypes,
    PageTwoPropTypes,
    MetaFieldsPropTypes,
    MetaInputType,
    MetaDropdownType,
    PageThreePropTypes,
    CommissionRatePropTypes,
    NextStepPropTypes,
    PreviousStepPropTypes
};
