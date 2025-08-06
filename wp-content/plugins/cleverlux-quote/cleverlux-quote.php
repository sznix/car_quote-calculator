<?php
/**
 * Plugin Name: CleverLux Quote
 * Description: Quote calculator scaffold.
 * Version: 1.0.0
 * Author: CleverLux
 *
 * @package CleverLux\Quote
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
	require __DIR__ . '/vendor/autoload.php';
}

require_once __DIR__ . '/includes/class-plugin.php';

CleverLux\Quote\Plugin::instance();
