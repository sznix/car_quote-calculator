<?php
/**
 * Shortcode handler.
 *
 * @package CleverLux\\Quote
 */

namespace CleverLux\Quote;

/**
 * Registers the [cleverlux_quote] shortcode.
 */
class Shortcode {
	/**
	 * Singleton instance.
	 *
	 * @var Shortcode
	 */
	private static $instance;

	/**
	 * Get instance.
	 *
	 * @return Shortcode
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
		add_shortcode( 'cleverlux_quote', array( $this, 'render' ) );
	}

	/**
	 * Render shortcode.
	 *
	 * @return string
	 */
	public function render() {
		Assets::instance()->enqueue();
		// Use a class instead of a duplicate id to support multiple instances.
		return '<div class="cleverlux-quote"></div>';
	}
}
