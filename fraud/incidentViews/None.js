// @flow
import React from 'react';
import { translate as l } from 'app/utils';

/* ==[Component]=========================================== */

type IncidentViewProps = {
    className: {}
};

const IncidentView = ({ className }: IncidentViewProps) => {
    return (
        <h4 className={className} style={{ textAlign: 'center', marginTop: 100 }}>
            {l('There are no incident details to display ...')}
        </h4>
    );
};

/* ==[Export]============================================== */

export { IncidentView as default };
