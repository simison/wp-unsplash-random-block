/* global wp */
/* eslint react/react-in-jsx-scope: 0 */

( function( blocks, components, i18n ) {
	const { __ } = i18n;
	const { registerBlockType } = blocks;
	const { Placeholder, IconButton, TextControl, ToggleControl } = components;

	let timer, req;

	registerBlockType( 'unsplash/random', {
		title: __( 'Random Unsplash.com Photo' ),
		description: __( 'Get a random photo from Unsplash.com' ),
		icon: 'format-image',
		category: 'layout',
		keywords: [ __( 'photo' ), 'unsplash' ],
		attributes: {
			keyword: {
				type: 'string',
			},
			loading: {
				type: 'boolean',
				default: false,
			},
			featured: {
				type: 'boolean',
				default: true,
			},
			image: {
				type: 'string',
			},
		},

		edit: ( { attributes, setAttributes } ) => {
			const { image, featured, keyword, loading } = attributes;

			const transferComplete = res => {
				setAttributes( { loading: false, image: res.target.responseURL } );
			};

			const transferFailed = () => {
				setAttributes( { loading: false } );
			};

			// Turn random URL into a static URL
			const getRandomImage = ( timerDelay = 1500 ) => {
				setAttributes( { loading: true } );

				clearTimeout( timer );

				// Cancel any ongoing requests
				if ( req ) {
					req.abort();
				}

				timer = setTimeout( () => {
					req = new XMLHttpRequest();
					req.addEventListener( 'load', transferComplete );
					req.addEventListener( 'error', transferFailed );

					// Docs: https://source.unsplash.com/
					const randomUrl = 'https://source.unsplash.com/random/' +
						( featured ? 'featured/' : '' ) +
						'?cache=' + Date.now() +
						( keyword ? '&' + keyword : '' );

					// Get redirected, real URL
					req.open( 'GET', randomUrl, true );
					req.send();
				}, timerDelay );
			};

			const onChangeKeyword = value => {
				setAttributes( { keyword: value } );
				getRandomImage();
			};

			const toggleFeatured = () => {
				setAttributes( { featured: ! featured } );
				getRandomImage();
			};

			// @TODO: `componentDidMount()`
			if ( ! image ) {
				getRandomImage( 0 );
			}

			return (
				<div className={ loading ? 'unsplash-random is-loading' : 'unsplash-random' }>
					<figure>
						{ image
							? <img src={ image } alt="" className="unsplash-random-image" />
							: <Placeholder icon="format-image" className="unsplash-random-placeholder" />
						}
					</figure>
					<TextControl
						placeholder={ __( 'Any topic' ) }
						label={ __( 'Search images' ) }
						value={ keyword }
						onChange={ onChangeKeyword }
					/>
					<ToggleControl
						label={ __( 'Featured images only' ) }
						checked={ !! featured }
						onChange={ toggleFeatured }
					/>
					<IconButton icon="image-rotate" onClick={ getRandomImage }>
						{ __( 'Gimme another pic' ) }
					</IconButton>
				</div>
			);
		},

		save: ( { attributes } ) => {
			return (
				<figure>
					<img src={ attributes.image } alt="" />
				</figure>
			);
		},
	} );
} )( wp.blocks, wp.components, wp.i18n );
