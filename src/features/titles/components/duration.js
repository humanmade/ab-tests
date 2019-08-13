import React, { useState, useEffect } from 'react';
import { getDurationString } from '../utils';

const Duration = props => {
	const { time = 0, interval = 60000 } = props;
	const [ duration, setDuration ] = useState( time );

	interval > 0 && useEffect( () => {
		const timer = setInterval( () => {
			setDuration( duration - interval );
		}, interval );

		return function cleanup() {
			clearInterval( timer );
		}
	} );

	if ( duration <= 0 ) {
		return null;
	}

	return (
		<span>{ getDurationString( duration ) }</span>
	)
};

export default Duration;
