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
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
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

	public function enqueue_admin_assets( $hook ) {
		if ( 'settings_page_cleverlux-quote' !== $hook ) {
			return;
		}
		
		wp_enqueue_style( 
			'cleverlux-admin', 
			plugin_dir_url( __FILE__ ) . '../assets/css/admin.css',
			array(),
			'1.0.0'
		);
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
		echo '<div class="wrap cleverlux-admin-page">';
		echo '<h1 class="wp-heading-inline">CleverLux Quote Settings</h1>';
		echo '<div class="admin-content">';
		echo '<form method="post" action="options.php" class="cleverlux-settings-form">';
		settings_fields( 'cleverlux_q_settings' );
		echo '<div class="settings-section">';
		echo '<h2>Quote Calculator Settings</h2>';
		echo '<p class="description">Configure pricing and options for the quote calculator.</p>';
		echo '</div>';
		echo '<div class="submit-section">';
		submit_button( 'Save Settings', 'primary', 'submit', false, array( 'aria-describedby' => 'save-help' ) );
		echo '<p id="save-help" class="description">Press Enter or click to save your settings</p>';
		echo '</div>';
		echo '</form>';
		echo '</div>';
		echo '</div>';
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
