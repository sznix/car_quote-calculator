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
		return '<div id="cleverlux-root" class="cleverlux-quote"></div>';
	}
}
