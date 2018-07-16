<?php
/**
 * Plugin Name: Unsplash Random Block
 * Version: 1.0.0
 * License: GPL2+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 */


defined( 'ABSPATH' ) || exit;

add_action( 'enqueue_block_editor_assets', 'unsplash_random_enqueue_block_editor_assets' );

function unsplash_random_enqueue_block_editor_assets() {
	wp_enqueue_script(
		'unsplash-random',
		plugins_url( 'block.build.js', __FILE__ ),
		array( 'wp-blocks', 'wp-i18n', 'wp-element' ),
		filemtime( plugin_dir_path( __FILE__ ) . 'block.build.js' )
	);

	wp_enqueue_style(
		'unsplash-random',
		plugins_url( 'style.css', __FILE__ ),
		array( 'wp-blocks' ),
		filemtime( plugin_dir_path( __FILE__ ) . 'style.css' )
	);
}
