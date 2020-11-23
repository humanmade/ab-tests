import React from 'react';
import Views from './views';

const { useSelect } = wp.data;
const { __, sprintf } = wp.i18n;

const BlockAnalytics = ( { clientId } ) => {
	const postId = useSelect( select => {
		return select( 'core/editor' ).getCurrentPostId();
	} );

	// No post ID so post isn't published, don't show anything.
	if ( ! postId ) {
		return null;
	}

	// Fetch the stats.
	const data = useSelect( select => {
		return select( 'analytics/xbs' ).getViews( clientId, postId );
	}, [ clientId, postId ] );
	const isLoading = useSelect( select => {
		return select( 'analytics/xbs' ).getIsLoading();
	}, [ data ] );

	const totalLoads = ( data && data.loads ) || 0;
	const totalViews = ( data && data.views ) || 0;

	return (
		<div className="altis-experience-block-analytics">
			<h4>{ __( 'Analytics', 'altis-experiments' ) }</h4>
			<p>{ __( 'Statistics shown are for the configured data retention period.', 'altis-experiments' ) }</p>
			<Views
				isLoading={ isLoading }
				label={ sprintf( __( '%d total page views', 'altis-experiments' ), totalLoads ) }
				conversionsLabel={ sprintf( __( '%d block views', 'altis-experiments' ), totalViews ) }
				total={ totalLoads }
				conversions={ totalViews }
			/>
		</div>
	);
};

export default BlockAnalytics;
