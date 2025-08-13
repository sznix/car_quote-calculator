<?php
namespace CleverLux\Quote;

class Settings {
	private static $instance = null;

	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		add_action( 'admin_menu', array( $this, 'register_menu' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
	}

	public function register_menu() {
		add_submenu_page(
			'options-general.php',
			'CleverLux Quote',
			'CleverLux Quote',
			'manage_options',
			'cleverlux-quote',
			array( $this, 'render_page' )
		);
	}

	public function register_settings() {
		register_setting( 'cleverlux_q_settings', 'cleverlux_q_settings', array( $this, 'sanitize' ) );
	}

	public function sanitize( $input ) {
		if ( isset( $input['free_miles'] ) ) {
			$input['free_miles'] = intval( $input['free_miles'] );
		}
		if ( isset( $input['mileage_rate'] ) ) {
			$input['mileage_rate'] = floatval( $input['mileage_rate'] );
		}
		if ( isset( $input['buffer_minutes'] ) ) {
			$input['buffer_minutes'] = intval( $input['buffer_minutes'] );
		}
		return $input;
	}

	public function render_page() {
		echo '<div class="wrap"><h1>CleverLux Quote</h1>';
		echo '<form method="post" action="options.php">';
		settings_fields( 'cleverlux_q_settings' );
		submit_button();
		echo '</form></div>';
	}

	public static function seed_defaults() {
		if ( false === get_option( 'cleverlux_q_settings' ) ) {
                        $defaults = array(
                                'price_matrix'   => array(
                                        'sedan'     => array(
                                                'silver'   => 109,
                                                'gold'     => 189,
                                                'platinum' => 299,
                                        ),
                                        'sports'    => array(
                                                'silver'   => 129,
                                                'gold'     => 219,
                                                'platinum' => 329,
                                        ),
                                        'small_suv' => array(
                                                'silver'   => 129,
                                                'gold'     => 219,
                                                'platinum' => 329,
                                        ),
                                        'large_suv' => array(
                                                'silver'   => 149,
                                                'gold'     => 249,
                                                'platinum' => 369,
                                        ),
                                        'full_van'  => array(
                                                'silver'   => 169,
                                                'gold'     => 279,
                                                'platinum' => 399,
                                        ),
                                        'boat'      => array(
                                                'silver'   => 219,
                                                'gold'     => 339,
                                                'platinum' => 499,
                                        ),
                                ),
                                'addons'         => array(
                                        array(
                                                'name' => 'Pet-hair removal',
                                                'fee'  => 25,
                                        ),
                                        array(
                                                'name' => 'Head-lamp restore',
                                                'fee'  => 35,
                                        ),
                                        array(
                                                'name' => 'Ceramic spray wax',
                                                'fee'  => 45,
                                        ),
                                        array(
                                                'name' => 'Ozone deodoriser',
                                                'fee'  => 35,
                                        ),
                                        array(
                                                'name' => 'Engine bay wipe-down',
                                                'fee'  => 30,
                                        ),
                                ),
				'free_miles'     => 20,
				'mileage_rate'   => 1.5,
				'buffer_minutes' => 45,
				'business_hours' => array(
					'Mon' => '08-18',
					'Tue' => '08-18',
					'Wed' => '08-18',
					'Thu' => '08-18',
					'Fri' => '08-18',
					'Sat' => '08-18',
				),
			);
			add_option( 'cleverlux_q_settings', $defaults );
		}
	}

	public static function get( $key, $fallback = null ) {
		$options = get_option( 'cleverlux_q_settings', array() );
		return isset( $options[ $key ] ) ? $options[ $key ] : $fallback;
	}
}
