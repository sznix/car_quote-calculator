<?php
namespace CleverLux\Quote;

class Plugin {
	private static $instance;

	private function __construct() {
		Settings::instance();
		load_plugin_textdomain( 'cleverlux-quote', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
	}

	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	public static function activate() {
		Schema::create_table();
		Settings::seed_defaults();
	}
}
