<?php
namespace CleverLux\Quote;

class Assets {
    public function init() : void {
        add_action( 'wp_enqueue_scripts', [ $this, 'enqueue' ] );
    }

    public function enqueue() : void {
        if ( ! is_singular() ) {
            return;
        }

        $post = get_post();
        if ( ! $post || ! has_shortcode( $post->post_content, 'cleverlux_quote_calculator' ) ) {
            return;
        }

        $css_path = CLEVERLUX_QUOTE_PLUGIN_PATH . 'assets/css/calculator.css';
        $css_ver  = file_exists( $css_path ) ? (string) filemtime( $css_path ) : '0.1.0';

        wp_enqueue_style(
            'cleverlux-quote-calculator',
            CLEVERLUX_QUOTE_PLUGIN_URL . 'assets/css/calculator.css',
            [],
            $css_ver
        );

        $js_rel  = 'assets/build/calculator.js';
        $js_path = CLEVERLUX_QUOTE_PLUGIN_PATH . $js_rel;
        $js_ver  = file_exists( $js_path ) ? (string) filemtime( $js_path ) : '0.1.0';

        wp_enqueue_script(
            'cleverlux-quote-calculator',
            CLEVERLUX_QUOTE_PLUGIN_URL . $js_rel,
            [],
            $js_ver,
            true
        );
    }
}
