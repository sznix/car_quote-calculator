/**
 * CleverLux Quote Calculator JavaScript
 * Handles form interactions, price calculations, and accessibility features
 */

(function() {
	'use strict';

	// Price matrix from PHP settings
	const priceMatrix = {
		sedan: { silver: 109, gold: 189, platinum: 299 },
		sports: { silver: 129, gold: 219, platinum: 329 },
		small_suv: { silver: 129, gold: 219, platinum: 329 },
		large_suv: { silver: 149, gold: 249, platinum: 369 },
		full_van: { silver: 169, gold: 279, platinum: 399 },
		boat: { silver: 219, gold: 339, platinum: 499 }
	};

	// Addon prices from PHP settings
	const addonPrices = [25, 35, 45, 35, 30];

	let currentTotal = 0;

	// Initialize calculator when DOM is ready
	document.addEventListener('DOMContentLoaded', function() {
		initializeCalculator();
	});

	function initializeCalculator() {
		const form = document.getElementById('quote-form');
		if (!form) return;

		// Add event listeners
		setupVehicleSizeListener();
		setupPackageListeners();
		setupAddonListeners();
		setupFormSubmission();
		setupKeyboardAccessibility();
	}

	function setupVehicleSizeListener() {
		const sizeSelect = document.getElementById('vehicle-size');
		if (!sizeSelect) return;

		sizeSelect.addEventListener('change', function() {
			updatePackagePrices();
			calculateTotal();
		});
	}

	function setupPackageListeners() {
		const packageRadios = document.querySelectorAll('.package-radio');
		packageRadios.forEach(radio => {
			radio.addEventListener('change', function() {
				calculateTotal();
			});
		});
	}

	function setupAddonListeners() {
		const addonCheckboxes = document.querySelectorAll('.addon-checkbox');
		addonCheckboxes.forEach(checkbox => {
			checkbox.addEventListener('change', function() {
				calculateTotal();
			});
		});
	}

	function setupFormSubmission() {
		const form = document.getElementById('quote-form');
		if (!form) return;

		form.addEventListener('submit', function(e) {
			e.preventDefault();
			handleFormSubmission();
		});
	}

	function setupKeyboardAccessibility() {
		// Make package options keyboard accessible
		const packageOptions = document.querySelectorAll('.package-option');
		packageOptions.forEach(option => {
			option.addEventListener('keydown', function(e) {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					const radio = option.querySelector('.package-radio');
					if (radio) {
						radio.checked = true;
						radio.dispatchEvent(new Event('change'));
					}
				}
			});

			// Add aria-pressed for visual feedback
			option.setAttribute('tabindex', '0');
			option.setAttribute('role', 'button');
			option.setAttribute('aria-pressed', 'false');
		});

		// Make addon options keyboard accessible
		const addonOptions = document.querySelectorAll('.addon-option');
		addonOptions.forEach(option => {
			option.addEventListener('keydown', function(e) {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					const checkbox = option.querySelector('.addon-checkbox');
					if (checkbox) {
						checkbox.checked = !checkbox.checked;
						checkbox.dispatchEvent(new Event('change'));
					}
				}
			});

			// Add aria-pressed for visual feedback
			option.setAttribute('tabindex', '0');
			option.setAttribute('role', 'button');
			option.setAttribute('aria-pressed', 'false');
		});

		// Update aria-pressed states when selections change
		updateAriaPressedStates();
	}

	function updateAriaPressedStates() {
		// Update package option aria-pressed states
		const packageOptions = document.querySelectorAll('.package-option');
		packageOptions.forEach(option => {
			const radio = option.querySelector('.package-radio');
			const isPressed = radio && radio.checked;
			option.setAttribute('aria-pressed', isPressed.toString());
		});

		// Update addon option aria-pressed states
		const addonOptions = document.querySelectorAll('.addon-option');
		addonOptions.forEach(option => {
			const checkbox = option.querySelector('.addon-checkbox');
			const isPressed = checkbox && checkbox.checked;
			option.setAttribute('aria-pressed', isPressed.toString());
		});
	}

	function updatePackagePrices() {
		const sizeSelect = document.getElementById('vehicle-size');
		const selectedSize = sizeSelect.value;
		
		if (!selectedSize || !priceMatrix[selectedSize]) return;

		const prices = priceMatrix[selectedSize];
		const packagePrices = document.querySelectorAll('.package-price');
		
		packagePrices.forEach(priceElement => {
			const packageType = priceElement.closest('.package-option').querySelector('.package-radio').value;
			if (prices[packageType]) {
				priceElement.textContent = `$${prices[packageType]}`;
			}
		});
	}

	function calculateTotal() {
		const sizeSelect = document.getElementById('vehicle-size');
		const selectedSize = sizeSelect.value;
		const selectedPackage = document.querySelector('.package-radio:checked');
		const selectedAddons = document.querySelectorAll('.addon-checkbox:checked');

		let total = 0;

		// Add package price
		if (selectedSize && selectedPackage && priceMatrix[selectedSize]) {
			const packageType = selectedPackage.value;
			total += priceMatrix[selectedSize][packageType] || 0;
		}

		// Add addon prices
		selectedAddons.forEach(addon => {
			const addonIndex = parseInt(addon.value);
			if (addonIndex >= 0 && addonIndex < addonPrices.length) {
				total += addonPrices[addonIndex];
			}
		});

		// Update display
		const totalElement = document.getElementById('total-amount');
		if (totalElement) {
			totalElement.textContent = `$${total}`;
			currentTotal = total;
		}

		// Update aria-pressed states
		updateAriaPressedStates();
	}

	function handleFormSubmission() {
		const sizeSelect = document.getElementById('vehicle-size');
		const selectedPackage = document.querySelector('.package-radio:checked');
		const selectedAddons = document.querySelectorAll('.addon-checkbox:checked');

		// Validate form
		if (!sizeSelect.value) {
			showError('Please select a vehicle size');
			sizeSelect.focus();
			return;
		}

		if (!selectedPackage) {
			showError('Please select a service package');
			return;
		}

		// Collect form data
		const formData = {
			vehicleSize: sizeSelect.value,
			package: selectedPackage.value,
			addons: Array.from(selectedAddons).map(addon => parseInt(addon.value)),
			total: currentTotal
		};

		// Submit form (you can customize this part)
		console.log('Quote submitted:', formData);
		showSuccess('Quote submitted successfully!');
	}

	function showError(message) {
		// Create or update error message
		let errorDiv = document.querySelector('.quote-error');
		if (!errorDiv) {
			errorDiv = document.createElement('div');
			errorDiv.className = 'quote-error';
			errorDiv.setAttribute('role', 'alert');
			errorDiv.setAttribute('aria-live', 'assertive');
			const form = document.getElementById('quote-form');
			form.insertBefore(errorDiv, form.firstChild);
		}
		
		errorDiv.textContent = message;
		errorDiv.style.display = 'block';
		errorDiv.style.color = '#dc3545';
		errorDiv.style.padding = '0.75rem';
		errorDiv.style.marginBottom = '1rem';
		errorDiv.style.backgroundColor = '#f8d7da';
		errorDiv.style.border = '1px solid #f5c6cb';
		errorDiv.style.borderRadius = '4px';
	}

	function showSuccess(message) {
		// Create or update success message
		let successDiv = document.querySelector('.quote-success');
		if (!successDiv) {
			successDiv = document.createElement('div');
			successDiv.className = 'quote-success';
			successDiv.setAttribute('role', 'status');
			successDiv.setAttribute('aria-live', 'polite');
			const form = document.getElementById('quote-form');
			form.insertBefore(successDiv, form.firstChild);
		}
		
		successDiv.textContent = message;
		successDiv.style.display = 'block';
		successDiv.style.color = '#155724';
		successDiv.style.padding = '0.75rem';
		successDiv.style.marginBottom = '1rem';
		successDiv.style.backgroundColor = '#d4edda';
		successDiv.style.border = '1px solid #c3e6cb';
		successDiv.style.borderRadius = '4px';
	}

})();