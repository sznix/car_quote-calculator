<?php
/**
 * Plugin Name:       CleverLux Quote
 * Description:       Provides the [cleverlux_quote_calculator] shortcode.
 * Version:           0.1.0
 * Author:            CleverLux
 */

namespace CleverLux\Quote;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'CLEVERLUX_QUOTE_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'CLEVERLUX_QUOTE_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );

require_once CLEVERLUX_QUOTE_PLUGIN_PATH . 'includes/class-plugin.php';
require_once CLEVERLUX_QUOTE_PLUGIN_PATH . 'includes/class-assets.php';
require_once CLEVERLUX_QUOTE_PLUGIN_PATH . 'sql/schema.php';

function activate() : void {
    Schema\create_tables();
}
register_activation_hook( __FILE__, __NAMESPACE__ . '\\activate' );

function run() : void {
    $plugin = new Plugin();
    $plugin->init();
}
run();
