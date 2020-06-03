import React, { Fragment, useEffect, useState } from 'react';
import VariantTitle from './components/variant-title';
import VariantPanel from './components/variant-panel';
import VariantToolbar from './components/variant-toolbar';

import withData from './data/edit';

const {
	BlockControls,
	InnerBlocks,
	InspectorControls,
} = wp.blockEditor;
const {
	Button,
	Toolbar,
} = wp.components;
const { __ } = wp.i18n;

/**
 * Only variants can be direct descendents so that we can generate
 * usable markup.
 */
const ALLOWED_BLOCKS = [ 'altis/personalization-variant' ];

/**
 * Start with a default template of one variant.
 */
const TEMPLATE = [
	[ 'altis/personalization-variant' ],
];

// Audience picker input.
const Edit = ( {
	attributes,
	className,
	clientId,
	isSelected,
	onAddVariant,
	onCopyVariant,
	onRemoveVariant,
	onSetClientId,
	onSetVariantParents,
	variants,
} ) => {
	// Track currently selected variant.
	const defaultVariantClientId = ( variants.length > 0 && variants[ 0 ].clientId ) || null;
	const [ activeVariant, setVariant ] = useState( defaultVariantClientId );

	// Track the active variant index to show in the title.
	const activeVariantIndex = variants.findIndex( variant => variant.clientId === activeVariant );

	// Set clientId attribute if not set.
	useEffect( () => {
		onSetClientId();
	}, [] );

	// Ensure variant parentId is correct.
	useEffect( () => {
		onSetVariantParents();
	}, [ attributes.clientId ] );

	// Controls that appear before the variant selector buttons.
	const variantsToolbarControls = [
		{
			icon: 'plus',
			title: __( 'Add a variant', 'altis-experiments' ),
			className: 'altis-add-variant-button',
			onClick: () => setVariant( onAddVariant() ),
		},
	];

	// When a variant is removed select the preceeding one along unless it's the first in the list.
	const onRemove = () => {
		if ( activeVariantIndex === 0 ) {
			setVariant( variants[ activeVariantIndex + 1 ].clientId );
		} else {
			setVariant( variants[ activeVariantIndex - 1 ].clientId );
		}
		onRemoveVariant( activeVariant );
	};

	return (
		<Fragment>
			<BlockControls>
				<Toolbar
					className="altis-variants-toolbar"
					controls={ variantsToolbarControls }
				>
					{ variants.map( variant => (
						<Button
							key={ `variant-select-${ variant.clientId }` }
							className={ `altis-variant-button components-icon-button has-text ${ activeVariant === variant.clientId && 'is-active' }` }
							title={ __( 'Select variant', 'altis-experiments' ) }
							onClick={ () => setVariant( variant.clientId ) }
						>
							<VariantTitle variant={ variant } />
						</Button>
					) ) }
				</Toolbar>
			</BlockControls>
			<InspectorControls>
				{ variants.map( variant => (
					<VariantPanel
						key={ `variant-settings-${ variant.clientId }` }
						variant={ variant }
					/>
				) ) }
			</InspectorControls>
			<style dangerouslySetInnerHTML={ {
				__html: `
					[data-block="${ clientId }"] [data-type="altis/personalization-variant"] {
						display: none;
					}
					[data-block="${ clientId }"] #block-${ activeVariant } {
						display: block;
					}
				`,
			} } />
			<div className={ className }>
				<div className="wp-core-ui altis-experience-block-header">
					<span className="altis-experience-block-header__title">
						{ __( 'Personalized Content', 'altis-experiments' ) }
						{ ' ・ ' }
						<VariantTitle variant={ variants[ activeVariantIndex ] } />
					</span>
					{ isSelected && (
						<VariantToolbar
							canRemove={ variants.length > 1 }
							isFallback={ activeVariant && variants[ activeVariantIndex ].attributes.fallback }
							onCopy={ () => setVariant( onCopyVariant( activeVariant ) ) }
							onRemove={ onRemove }
						/>
					) }
				</div>
				<InnerBlocks
					allowedBlocks={ ALLOWED_BLOCKS }
					renderAppender={ false }
					template={ TEMPLATE }
				/>
			</div>
		</Fragment>
	);
};

export default withData( Edit );
