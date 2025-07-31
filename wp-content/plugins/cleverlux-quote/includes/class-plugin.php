<?php
namespace CleverLux\Quote;

class Plugin {
    private static $instance;

    private function __construct() {
        new Settings();
    }

    public static function instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public static function activate() {
        global $wpdb;
        Schema::create_table( $wpdb );
        Settings::seed_defaults();
    }
}
