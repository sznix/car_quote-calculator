<?php
namespace CleverLux\Quote;

class Plugin {
	private static $instance;

	private function __construct() {
		Settings::instance();
		load_plugin_textdomain( 'cleverlux-quote', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
		
		// Add shortcode for frontend quote calculator
		add_shortcode( 'cleverlux_quote_calculator', array( $this, 'render_quote_calculator' ) );
		
		// Enqueue frontend assets
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_assets' ) );
	}

	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	public static function activate() {
		Schema::create_table();
		Settings::seed_defaults();
	}

	public function enqueue_frontend_assets() {
		wp_enqueue_style( 
			'cleverlux-quote-calculator', 
			plugin_dir_url( __FILE__ ) . '../assets/css/calculator.css',
			array(),
			'1.0.0'
		);
		wp_enqueue_script( 
			'cleverlux-quote-calculator', 
			plugin_dir_url( __FILE__ ) . '../assets/js/calculator.js',
			array(),
			'1.0.0',
			true
		);
	}

	public function render_quote_calculator( $atts ) {
		$price_matrix = Settings::get( 'price_matrix', array() );
		$addons = Settings::get( 'addons', array() );
		
		// Generate unique ID for this calculator instance
		$calculator_id = 'calculator-' . uniqid();
		
		ob_start();
		?>
		<div class="cleverlux-quote-calculator" role="region" aria-label="Quote Calculator" data-calculator-id="<?php echo esc_attr( $calculator_id ); ?>">
			<form class="quote-form" id="<?php echo esc_attr( $calculator_id ); ?>-form">
				<div class="form-section">
					<label for="<?php echo esc_attr( $calculator_id ); ?>-vehicle-size" class="form-label">Vehicle Size</label>
					<select id="<?php echo esc_attr( $calculator_id ); ?>-vehicle-size" name="vehicle_size" class="form-select" required aria-describedby="<?php echo esc_attr( $calculator_id ); ?>-size-help">
						<option value="">Select vehicle size...</option>
						<option value="sedan">Sedan</option>
						<option value="sports">Sports Car</option>
						<option value="small_suv">Small SUV</option>
						<option value="large_suv">Large SUV</option>
						<option value="full_van">Full Van</option>
						<option value="boat">Boat</option>
					</select>
					<div id="<?php echo esc_attr( $calculator_id ); ?>-size-help" class="help-text">Choose the size category that best matches your vehicle</div>
				</div>

				<div class="form-section">
					<label for="<?php echo esc_attr( $calculator_id ); ?>-package-type" class="form-label">Service Package</label>
					<div class="package-options" role="radiogroup" aria-labelledby="<?php echo esc_attr( $calculator_id ); ?>-package-label">
						<div id="<?php echo esc_attr( $calculator_id ); ?>-package-label" class="sr-only">Select a service package</div>
						<label class="package-option">
							<input type="radio" name="package" value="silver" class="package-radio" aria-describedby="<?php echo esc_attr( $calculator_id ); ?>-silver-desc">
							<span class="package-name">Silver</span>
							<span class="package-price" data-size="sedan" data-package="silver">$<?php echo esc_html( isset( $price_matrix['sedan']['silver'] ) ? $price_matrix['sedan']['silver'] : '109' ); ?></span>
							<div id="<?php echo esc_attr( $calculator_id ); ?>-silver-desc" class="package-desc">Basic exterior wash and interior cleaning</div>
						</label>
						<label class="package-option">
							<input type="radio" name="package" value="gold" class="package-radio" aria-describedby="<?php echo esc_attr( $calculator_id ); ?>-gold-desc">
							<span class="package-name">Gold</span>
							<span class="package-price" data-size="sedan" data-package="gold">$<?php echo esc_html( isset( $price_matrix['sedan']['gold'] ) ? $price_matrix['sedan']['gold'] : '189' ); ?></span>
							<div id="<?php echo esc_attr( $calculator_id ); ?>-gold-desc" class="package-desc">Silver package plus wax and tire dressing</div>
						</label>
						<label class="package-option">
							<input type="radio" name="package" value="platinum" class="package-radio" aria-describedby="<?php echo esc_attr( $calculator_id ); ?>-platinum-desc">
							<span class="package-name">Platinum</span>
							<span class="package-price" data-size="sedan" data-package="platinum">$<?php echo esc_html( isset( $price_matrix['sedan']['platinum'] ) ? $price_matrix['sedan']['platinum'] : '299' ); ?></span>
							<div id="<?php echo esc_attr( $calculator_id ); ?>-platinum-desc" class="package-desc">Gold package plus paint correction and ceramic coating</div>
						</label>
					</div>
				</div>

				<div class="form-section">
					<label class="form-label">Additional Services</label>
					<div class="addon-options" role="group" aria-labelledby="<?php echo esc_attr( $calculator_id ); ?>-addon-label">
						<div id="<?php echo esc_attr( $calculator_id ); ?>-addon-label" class="sr-only">Select additional services</div>
						<?php foreach ( $addons as $index => $addon ) : ?>
							<label class="addon-option">
								<input type="checkbox" name="addons[]" value="<?php echo esc_attr( $index ); ?>" class="addon-checkbox" aria-describedby="<?php echo esc_attr( $calculator_id ); ?>-addon-<?php echo esc_attr( $index ); ?>-desc">
								<span class="addon-name"><?php echo esc_html( $addon['name'] ); ?></span>
								<span class="addon-price">+$<?php echo esc_html( $addon['fee'] ); ?></span>
								<div id="<?php echo esc_attr( $calculator_id ); ?>-addon-<?php echo esc_attr( $index ); ?>-desc" class="addon-desc sr-only">Additional service: <?php echo esc_html( $addon['name'] ); ?></div>
							</label>
						<?php endforeach; ?>
					</div>
				</div>

				<div class="quote-summary" role="status" aria-live="polite">
					<div class="total-price">
						<span class="total-label">Total:</span>
						<span class="total-amount" id="<?php echo esc_attr( $calculator_id ); ?>-total-amount">$0</span>
					</div>
				</div>

				<button type="submit" class="submit-button" aria-describedby="<?php echo esc_attr( $calculator_id ); ?>-submit-help">
					Get Quote
				</button>
				<div id="<?php echo esc_attr( $calculator_id ); ?>-submit-help" class="help-text">Press Enter or click to submit your quote request</div>
			</form>
		</div>
		<?php
		return ob_get_clean();
	}
}
