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
        $form  = '<form class="cleverlux-quote-form">';
        $form .= '<input type="text" placeholder="' . esc_attr__( 'Your car model', 'cleverlux-quote' ) . '" />';
        $form .= wp_nonce_field( 'cleverlux_quote_submit', 'cleverlux_quote_nonce', true, false );
        $form .= '</form>';

        $output  = '<div class="cleverlux-quote"></div>';
        $output .= '<noscript>' . $form . '</noscript>';
        return $output;
    }
}
