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
		// Resolve paths/URLs from the plugin root, not the includes directory.
		$plugin_root      = dirname( __DIR__ );
		$plugin_root_file = $plugin_root . '/cleverlux-quote.php';
		$plugin_url       = plugin_dir_url( $plugin_root_file );
		$plugin_path      = trailingslashit( $plugin_root );

		// Prefer @wordpress/scripts default output in build/; fall back to legacy assets/build/.
		$build_dir_candidates = array(
			array(
				'path' => $plugin_path . 'build/',
				'url'  => $plugin_url . 'build/',
			),
			array(
				'path' => $plugin_path . 'assets/build/',
				'url'  => $plugin_url . 'assets/build/',
			),
		);

		$build_path = null;
		$build_url  = null;
		foreach ( $build_dir_candidates as $candidate ) {
			if ( file_exists( $candidate['path'] . 'index.js' ) && file_exists( $candidate['path'] . 'index.asset.php' ) ) {
				$build_path = $candidate['path'];
				$build_url  = $candidate['url'];
				break;
			}
		}

		// As a last resort, still allow registering even if missing, to avoid fatals in non-built environments.
		if ( ! $build_path ) {
			$build_path = $plugin_path . 'build/';
			$build_url  = $plugin_url . 'build/';
		}

		$asset_file = $build_path . 'index.asset.php';
		$asset      = file_exists( $asset_file ) ? require $asset_file : array(
			'dependencies' => array( 'wp-element', 'wp-i18n' ),
			'version'      => file_exists( $build_path . 'index.js' ) ? filemtime( $build_path . 'index.js' ) : null,
		);

		wp_register_script(
			'cleverlux-quote',
			$build_url . 'index.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);

		$css_file = $plugin_path . 'assets/css/cleverlux-ui.css';
		wp_register_style(
			'cleverlux-ui',
			$plugin_url . 'assets/css/cleverlux-ui.css',
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
		// Avoid adding duplicate meta tags if the shortcode is rendered multiple times.
		if ( ! has_action( 'wp_head', array( $this, 'theme_color_meta' ) ) ) {
			add_action( 'wp_head', array( $this, 'theme_color_meta' ) );
		}
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
