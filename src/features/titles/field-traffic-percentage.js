import React, { Fragment } from 'react';
import styled from 'styled-components';
import deepmerge from 'deepmerge';

const { RangeControl } = wp.components;
const { withSelect, withDispatch, useSelect } = wp.data;
const { compose } = wp.compose;
const { __ } = wp.i18n;

const StyledRangeControl = styled( RangeControl )`
.components-base-control__field { justify-content: flex-start; }
.components-range-control__slider { flex: 1 1 50%; }
`

export const TrafficPercentage = props => {
	const { percentage, setPercentage } = props;

	return (
		<Fragment>
			<StyledRangeControl
				label={ __( 'Traffic Percentage' ) }
				value={ percentage }
				onChange={ value => setPercentage( value ) }
				help={ __( 'This is the amount of traffic that will be shown one of the variants.' ) }
				min={ 0 }
				max={ 100 }
			/>
		</Fragment>
	);
};

export const TrafficPercentageWithData = compose(
	withSelect( select => {
		const percentage = select( 'core/editor' )
			.getEditedPostAttribute( 'ab_tests' ).titles.traffic_percentage || 35;
		return {
			percentage: parseFloat( percentage ),
			ab_tests: select( 'core/editor' ).getEditedPostAttribute( 'ab_tests' )
		};
	} ),
	withDispatch( ( dispatch, props ) => {
		return {
			setPercentage: percentage => {
				dispatch( 'core/editor' ).editPost( deepmerge( {
					ab_tests: props.ab_tests,
				}, {
					ab_tests: {
						titles: {
							traffic_percentage: percentage
						}
					}
				} ) );
			}
		};
	} )
)( TrafficPercentage );

export default TrafficPercentageWithData;