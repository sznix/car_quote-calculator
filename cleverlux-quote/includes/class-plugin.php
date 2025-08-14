<?php
namespace CleverLux\Quote;

class Plugin {
    public function init() : void {
        add_shortcode( 'cleverlux_quote_calculator', [ $this, 'render' ] );
        $assets = new Assets();
        $assets->init();
    }

    /**
     * Render placeholder form for quote calculator.
     */
    public function render( array $atts = [], ?string $content = null ) : string {
        $output  = '<form class="cleverlux-quote-form">';
        $output .= '<input type="text" placeholder="' . esc_attr__( 'Your car model', 'cleverlux-quote' ) . '" />';
        $output .= wp_nonce_field( 'cleverlux_quote_submit', 'cleverlux_quote_nonce', true, false );
        $output .= '</form>';
        return $output;
    }
}
