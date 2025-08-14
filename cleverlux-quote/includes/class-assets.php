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

        wp_enqueue_style(
            'cleverlux-quote-calculator',
            CLEVERLUX_QUOTE_PLUGIN_URL . 'assets/css/calculator.css',
            [],
            '0.1.0'
        );

        wp_enqueue_script(
            'cleverlux-quote-calculator',
            CLEVERLUX_QUOTE_PLUGIN_URL . 'assets/js/calculator.js',
            [],
            '0.1.0',
            true
        );
    }
}
