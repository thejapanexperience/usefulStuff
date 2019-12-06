// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Dropdown } from '@phg/stilo-toolbox/v2/component';
import { translate as l } from 'app/utils';

/* ==[Component]=========================================== */

type PartnerActionsProps = {
    actionOptions: Array<{ name: string, value: string, disabled: boolean }>
};

const PartnerActions = ({
    actionOptions
}: PartnerActionsProps) => {
    return (
        <div className="action-controls">
            <div className="action-title">{l('Actions')} </div>
            <Dropdown
                positionVertical={'right'}
                defaultOpen={false}
                id="partner-actions"
                onSelect={() => {

                }}
                value=""
                placeholder={l('Choose...')}
            >
                {
                    // filter so only enabled options are showed.
                    actionOptions.filter(option => option.disabled !== true).map((option, index) =>
                        <Dropdown.Item id={option.name} key={index} value={option.value}>
                            {l(option.name)}
                        </Dropdown.Item>)
                }
            </Dropdown>
        </div>
    );
};

/* ==[Redux]=============================================== */

const mapStateToProps = () => ({
    actionOptions: [{}, {}]
});

const mapDispatchToProps = () => ({
});

const ConnectedPartnerActions = connect(mapStateToProps, mapDispatchToProps)(PartnerActions);

/* ==[Export]============================================== */

export { ConnectedPartnerActions as default, PartnerActions };
