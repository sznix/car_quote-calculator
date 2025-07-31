<?php
/**
 * Plugin Name: CleverLux Quote
 * Description: Quote calculator plugin for CleverLux.
 * Version: 0.1.0
 * Author: CleverLux
 * License: GPL-2.0-or-later
 * Text Domain: cleverlux-quote
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/includes/class-plugin.php';
if ( file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
	require_once __DIR__ . '/vendor/autoload.php';
}
if ( class_exists( 'CleverLux\\Quote\\Plugin' ) ) {
	register_activation_hook( __FILE__, array( 'CleverLux\\Quote\\Plugin', 'activate' ) );
	add_action( 'plugins_loaded', array( 'CleverLux\\Quote\\Plugin', 'instance' ) );
}

add_action(
	'wp_head',
	function () {
		echo '<meta name="theme-color" content="#0A1A2F" media="(prefers-color-scheme: light)">';
	}
);
