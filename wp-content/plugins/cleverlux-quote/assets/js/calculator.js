/**
 * CleverLux Quote Calculator JavaScript
 * Handles form interactions, price calculations, and accessibility features
 * Supports multiple calculator instances on the same page
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

	// Store calculator instances
	const calculatorInstances = new Map();

	// Initialize calculator when DOM is ready
	document.addEventListener('DOMContentLoaded', function() {
		initializeAllCalculators();
	});

	function initializeAllCalculators() {
		const calculators = document.querySelectorAll('.cleverlux-quote-calculator');
		calculators.forEach(calculator => {
			const calculatorId = calculator.getAttribute('data-calculator-id');
			if (calculatorId) {
				initializeCalculator(calculator, calculatorId);
			}
		});
	}

	function initializeCalculator(calculatorElement, calculatorId) {
		const form = calculatorElement.querySelector('.quote-form');
		if (!form) return;

		// Create calculator instance object
		const instance = {
			element: calculatorElement,
			id: calculatorId,
			currentTotal: 0,
			form: form
		};

		// Store instance
		calculatorInstances.set(calculatorId, instance);

		// Add event listeners
		setupVehicleSizeListener(instance);
		setupPackageListeners(instance);
		setupAddonListeners(instance);
		setupFormSubmission(instance);
		setupKeyboardAccessibility(instance);
	}

	function setupVehicleSizeListener(instance) {
		const sizeSelect = instance.element.querySelector(`#${instance.id}-vehicle-size`);
		if (!sizeSelect) return;

		sizeSelect.addEventListener('change', function() {
			updatePackagePrices(instance);
			calculateTotal(instance);
		});
	}

	function setupPackageListeners(instance) {
		const packageRadios = instance.element.querySelectorAll('.package-radio');
		packageRadios.forEach(radio => {
			radio.addEventListener('change', function() {
				calculateTotal(instance);
			});
		});
	}

	function setupAddonListeners(instance) {
		const addonCheckboxes = instance.element.querySelectorAll('.addon-checkbox');
		addonCheckboxes.forEach(checkbox => {
			checkbox.addEventListener('change', function() {
				calculateTotal(instance);
			});
		});
	}

	function setupFormSubmission(instance) {
		instance.form.addEventListener('submit', function(e) {
			e.preventDefault();
			handleFormSubmission(instance);
		});
	}

	function setupKeyboardAccessibility(instance) {
		// Make package options keyboard accessible
		const packageOptions = instance.element.querySelectorAll('.package-option');
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
		const addonOptions = instance.element.querySelectorAll('.addon-option');
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
		updateAriaPressedStates(instance);
	}

	function updateAriaPressedStates(instance) {
		// Update package option aria-pressed states
		const packageOptions = instance.element.querySelectorAll('.package-option');
		packageOptions.forEach(option => {
			const radio = option.querySelector('.package-radio');
			const isPressed = radio && radio.checked;
			option.setAttribute('aria-pressed', isPressed.toString());
		});

		// Update addon option aria-pressed states
		const addonOptions = instance.element.querySelectorAll('.addon-option');
		addonOptions.forEach(option => {
			const checkbox = option.querySelector('.addon-checkbox');
			const isPressed = checkbox && checkbox.checked;
			option.setAttribute('aria-pressed', isPressed.toString());
		});
	}

	function updatePackagePrices(instance) {
		const sizeSelect = instance.element.querySelector(`#${instance.id}-vehicle-size`);
		const selectedSize = sizeSelect.value;
		
		if (!selectedSize || !priceMatrix[selectedSize]) return;

		const prices = priceMatrix[selectedSize];
		const packagePrices = instance.element.querySelectorAll('.package-price');
		
		packagePrices.forEach(priceElement => {
			const packageType = priceElement.getAttribute('data-package');
			if (prices[packageType]) {
				priceElement.textContent = `$${prices[packageType]}`;
			}
		});
	}

	function calculateTotal(instance) {
		const sizeSelect = instance.element.querySelector(`#${instance.id}-vehicle-size`);
		const selectedSize = sizeSelect.value;
		const selectedPackage = instance.element.querySelector('.package-radio:checked');
		const selectedAddons = instance.element.querySelectorAll('.addon-checkbox:checked');

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
		const totalElement = instance.element.querySelector(`#${instance.id}-total-amount`);
		if (totalElement) {
			totalElement.textContent = `$${total}`;
			instance.currentTotal = total;
		}

		// Update aria-pressed states
		updateAriaPressedStates(instance);
	}

	function handleFormSubmission(instance) {
		const sizeSelect = instance.element.querySelector(`#${instance.id}-vehicle-size`);
		const selectedPackage = instance.element.querySelector('.package-radio:checked');
		const selectedAddons = instance.element.querySelectorAll('.addon-checkbox:checked');

		// Validate form
		if (!sizeSelect.value) {
			showError(instance, 'Please select a vehicle size');
			sizeSelect.focus();
			return;
		}

		if (!selectedPackage) {
			showError(instance, 'Please select a service package');
			return;
		}

		// Collect form data
		const formData = {
			vehicleSize: sizeSelect.value,
			package: selectedPackage.value,
			addons: Array.from(selectedAddons).map(addon => parseInt(addon.value)),
			total: instance.currentTotal
		};

		// Submit form (you can customize this part)
		console.log('Quote submitted:', formData);
		showSuccess(instance, 'Quote submitted successfully!');
	}

	function showError(instance, message) {
		// Create or update error message
		let errorDiv = instance.element.querySelector('.quote-error');
		if (!errorDiv) {
			errorDiv = document.createElement('div');
			errorDiv.className = 'quote-error';
			errorDiv.setAttribute('role', 'alert');
			errorDiv.setAttribute('aria-live', 'assertive');
			instance.form.insertBefore(errorDiv, instance.form.firstChild);
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

	function showSuccess(instance, message) {
		// Create or update success message
		let successDiv = instance.element.querySelector('.quote-success');
		if (!successDiv) {
			successDiv = document.createElement('div');
			successDiv.className = 'quote-success';
			successDiv.setAttribute('role', 'status');
			successDiv.setAttribute('aria-live', 'polite');
			instance.form.insertBefore(successDiv, instance.form.firstChild);
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