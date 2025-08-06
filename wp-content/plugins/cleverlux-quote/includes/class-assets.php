<?php
/**
 * Asset loader.
 *
 * @package CleverLux\Quote
 */

namespace CleverLux\Quote;

/**
 * Handles registration and conditional loading of assets.
 */
class Assets {
	/**
	 * Singleton instance.
	 *
	 * @var Assets
	 */
	private static $instance;

	/**
	 * Retrieve instance.
	 *
	 * @return Assets
	 */
	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Set up hooks.
	 */
	private function __construct() {
		add_action( 'init', array( $this, 'register' ) );
	}

	/**
	 * Register script and style.
	 */
	public function register() {
		$dir_url  = plugin_dir_url( __DIR__ );
		$dir_path = plugin_dir_path( __DIR__ );

		$asset_file = $dir_path . 'assets/build/index.asset.php';
		$asset      = file_exists( $asset_file ) ? require $asset_file : array(
			'dependencies' => array( 'wp-element', 'wp-i18n' ),
			'version'      => filemtime( $dir_path . 'assets/build/index.js' ),
		);

		wp_register_script(
			'cleverlux-quote',
			$dir_url . 'assets/build/index.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);

		$css_file = $dir_path . 'assets/css/cleverlux-ui.css';
		wp_register_style(
			'cleverlux-ui',
			$dir_url . 'assets/css/cleverlux-ui.css',
			array(),
			file_exists( $css_file ) ? filemtime( $css_file ) : null
		);
	}

	/**
	 * Enqueue assets if shortcode present.
	 */
	public function enqueue() {
		if ( ! is_singular() ) {
			return;
		}
		$post = get_post();
		if ( ! $post || ! has_shortcode( $post->post_content, 'cleverlux_quote' ) ) {
			return;
		}
		wp_enqueue_script( 'cleverlux-quote' );
		wp_enqueue_style( 'cleverlux-ui' );
		add_action( 'wp_head', array( $this, 'theme_color_meta' ) );
	}

	/**
	 * Output theme-color meta tags for light and dark modes.
	 */
	public function theme_color_meta() {
		echo '<meta name="theme-color" content="#F5E5D0">' . "\n"; // Gold (default)
		echo '<meta name="theme-color" content="#12365C" media="(prefers-color-scheme: light)">' . "\n"; // Navy-600
		echo '<meta name="theme-color" content="#0A1A2F" media="(prefers-color-scheme: dark)">' . "\n"; // Navy-900
	}
}
