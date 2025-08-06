<?php
/**
 * Plugin bootstrap.
 *
 * @package CleverLux\Quote
 */

namespace CleverLux\Quote;

require_once __DIR__ . '/class-assets.php';
require_once __DIR__ . '/class-shortcode.php';

/**
 * Main plugin class.
 */
class Plugin {
	/**
	 * Singleton instance.
	 *
	 * @var Plugin
	 */
	private static $instance;

	/**
	 * Get instance.
	 *
	 * @return Plugin
	 */
	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Constructor.
	 */
	private function __construct() {
		Assets::instance();
		Shortcode::instance();
	}
}
