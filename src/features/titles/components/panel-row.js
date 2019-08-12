/* global wp */
import styled from 'styled-components';

const { PanelRow } = wp.components;

const StyledPanelRow = styled( PanelRow )`
	.altis-ab-tests-panel-row {
		flex: 0 0 100%;
	}
	.components-base-control__help {
		margin-top: 5px;
		color: #666;
	}
	label {
		font-weight: 500;
	}
`;

const PanelRowInner = props => (
	<StyledPanelRow>
		<div className="altis-ab-tests-panel-row">
			{ props.children }
		</div>
	</StyledPanelRow>
);

export default PanelRowInner;
