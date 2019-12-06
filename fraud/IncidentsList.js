// @flow
import React from 'react';
import { convertToTimeZone } from 'date-fns-timezone';

import { formatTimeDistance, translate as l } from 'app/utils';
import type { Locale } from 'app/utils/dates';
import type { Incident } from 'app/api/endpoints/v2/campaigns/fraud/incidents/types';


const viewLabelsByIncidentType = {
    volume_clicks: l('Number of clicks'),
    volume_conversions: l('Number of conversions'),
    conversion_ration: l('Click to conversion ratio'),
    basket_variability_sku: '',
    conversion_value: l('Conversion value'),
    ttc: ''
};

/* ==[Component]=========================================== */

type IncidentsListProps = {
    incidents: Array<Incident>,
    selectedIncident: Incident,
    onSelect: (Incident) => void,
    userLocale: Locale,
    campaign: { [key: string]: * }
};

const IncidentsList = ({
    incidents,
    selectedIncident,
    onSelect,
    userLocale,
    campaign
}: IncidentsListProps) => (
    <div>
        { incidents && incidents.map( (incident: Incident) => (
            <div
                key={incident.id}
                data-testid="fraud_incidents_list_item"
                className={`incident-item${selectedIncident && incident.id == selectedIncident.id ? ' selected' : ''}`}
                onClick = { () => onSelect(incident) }
            >
                <br /><span className="incident-type">{l(viewLabelsByIncidentType[incident.incident_type])}</span>
                <br /><span className="publisher-name">{incident.publisher.name}</span> <strong>{'\u2027'}</strong> {
                    formatTimeDistance(userLocale)(
                        convertToTimeZone(new Date(incident.occurred_at), { timeZone: campaign && campaign.reporting_timezone }), new Date()
                    )
                }
            </div>
        )) }
    </div>
);

/* ==[Export]============================================== */

export { IncidentsList as default };
