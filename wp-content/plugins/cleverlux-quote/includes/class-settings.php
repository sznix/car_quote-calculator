<?php
namespace CleverLux\Quote;

class Settings {
    public function __construct() {
        add_action( 'admin_menu', [ $this, 'register_menu' ] );
        add_action( 'admin_init', [ $this, 'register_settings' ] );
    }

    public function register_menu() {
        add_submenu_page(
            'options-general.php',
            'CleverLux Quote',
            'CleverLux Quote',
            'manage_options',
            'cleverlux-quote',
            [ $this, 'render_page' ]
        );
    }

    public function register_settings() {
        register_setting( 'cleverlux_q_settings', 'cleverlux_q_settings' );
    }

    public function render_page() {
        echo '<div class="wrap"><h1>CleverLux Quote</h1></div>';
    }

    public static function seed_defaults() {
        if ( false === get_option( 'cleverlux_q_settings' ) ) {
            $defaults = [
                'price_matrix'   => [],
                'addons'         => [],
                'free_miles'     => 20,
                'mileage_rate'   => 1.5,
                'buffer_minutes' => 45,
                'business_hours' => [
                    'Mon' => '08-18',
                    'Tue' => '08-18',
                    'Wed' => '08-18',
                    'Thu' => '08-18',
                    'Fri' => '08-18',
                    'Sat' => '08-18',
                ],
            ];
            add_option( 'cleverlux_q_settings', $defaults );
        }
    }

    public static function get( $key, $fallback = null ) {
        $options = get_option( 'cleverlux_q_settings', [] );
        return isset( $options[ $key ] ) ? $options[ $key ] : $fallback;
    }
}
