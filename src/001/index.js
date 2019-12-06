// @flow

// $FlowIgnore
import React from 'react';
import { connect } from 'react-redux';
import { PageTitle } from 'stilo-toolbox/src/v2/component';
import { Context, Main, FShape, Wide } from 'stilo-toolbox/src/v2/layout/page';
import Loader from 'stilo-toolbox/src/components/Loader';
import { withStyles } from 'stilo-toolbox/src/components/ThemeProvider';

import { componentMount, translate as l } from 'app/utils';
import type { Locale } from 'app/utils/dates';
import api from 'app/api';
import userData from 'app/state/globalDucks/userData';
import type { Incident } from 'app/api/endpoints/v2/campaigns/fraud/incidents/types';

import pageState from './pageState';
import PartnerActions from './partnerActions';
import makeStyle from './style';
import incidentViews from './incidentViews';
import IncidentsList from './IncidentsList';

const viewComponentsByIncidentType = {
    volume_clicks: null,
    volume_conversions: null,
    conversion_ration: null,
    basket_variability_sku: null,
    conversion_value: null,
    ttc: null
};

type FraudPageProps = {
    loading: boolean,   /** TO-DO: watch the requried endpoints and display proper UI when there are designs to describe that **/
    classes: { Page: string, Main: string, Context: string, Wide: string, FShape: string },
    incidents: Array<Incident>,
    selectedIncident: Incident,
    userLocale: Locale,
    onIncidentSelect: Incident => void,
    campaign: { [key: string]: * }
};

const FraudPage = ({ classes, loading, incidents, selectedIncident, userLocale, onIncidentSelect, campaign }: FraudPageProps) => {

    const ViewComp = viewComponentsByIncidentType[selectedIncident && selectedIncident.incident_type] || incidentViews['None'];

    const campaignData = campaign || {};

    return (
        <FShape className={classes.FShape}>
            <Wide className={classes.Wide}>
                <Wide.Header>{l('Incidents')}</Wide.Header>
                { loading
                    ? <Loader />
                    :
                    <IncidentsList
                        incidents={incidents}
                        selectedIncident={selectedIncident}
                        userLocale={userLocale}
                        campaign={campaignData}
                        onSelect={onIncidentSelect}
                    />
                }
            </Wide>
            <Context className={classes.Context}>
                <PageTitle>{l('Fraud Summary')}</PageTitle>
                <div className="headerAction">
                    <PartnerActions />
                </div>
            </Context>
            <Main className={classes.Main}>
                { loading
                    ? <Loader />
                    :
                    <ViewComp className={classes.Page} campaign={campaignData}>

                    </ViewComp>
                }
            </Main>
        </FShape>
    );
};

const mapStateToProps = (state) => ({
    loading: api.v2CampaignFraudIncidents.selectors.selectLoading(state) || api.campaign.selectors.selectLoading(state),
    incidents: api.v2CampaignFraudIncidents.selectors.selectData(state),
    selectedIncident: pageState.selectors.selectSelectedIncident(state),
    userLocale: userData.selectors.selectUserLocale(state),
    campaign: api.campaign.selectors.selectData(state),
});

const mapDispatchToProps = (dispatch) => ({
    onMountLoadAction: () => {
        dispatch(api.v2CampaignFraudIncidents.actionCreators.fetchAction());
        dispatch(api.campaign.actionCreators.fetchAction());
    },
    onIncidentSelect: incident => {
        dispatch(pageState.actionCreators.setSelectedIncident(incident));
    }
});

const ConnectedFraudPage = connect(mapStateToProps, mapDispatchToProps)(componentMount(FraudPage));
const StyledFraudPage = withStyles(makeStyle)(ConnectedFraudPage);

export { StyledFraudPage as default };
