import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import VehicleSizeTiles from './components/VehicleSizeTiles';
import useVehicleLookup from './hooks/useVehicleLookup';
import { Dialog } from '@headlessui/react';
import { useHaptic } from './hooks/useHaptic';

const stepsPlaceholder = [
	'Select your vehicle size.',
	'Other steps coming soon…',
];

function App() {
	const [ currentStep, setCurrentStep ] = useState( 0 );
	const [ selectedSize, setSelectedSize ] = useState( null );
	const [ modalOpen, setModalOpen ] = useState( false );
	const [ lookupInput, setLookupInput ] = useState( '' );
	const lookupResult = useVehicleLookup( lookupInput );
	const haptic = useHaptic();

	const handleLookupSelect = () => {
		if ( lookupResult ) {
			setSelectedSize( lookupResult );
			setModalOpen( false );
			haptic();
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center">
			{ currentStep === 0 ? (
				<div className="w-full">
					<VehicleSizeTiles
						selected={ selectedSize }
						onSelect={ setSelectedSize }
					/>
					<div className="mt-4 flex justify-center">
						<button
							className="text-xs text-blue-600 underline hover:text-yellow-600 focus:outline-none"
							onClick={ () => setModalOpen( true ) }
							type="button"
						>
							Not sure?
						</button>
					</div>

					<Dialog
						open={ modalOpen }
						onClose={ () => setModalOpen( false ) }
						className="fixed z-50 inset-0 flex items-center justify-center"
					>
						<Dialog.Overlay className="fixed inset-0 bg-black/30" />
						<div className="relative bg-white rounded-xl shadow-lg max-w-sm w-full p-6 z-10">
							<Dialog.Title className="font-bold text-lg mb-2">
								Search your vehicle model
							</Dialog.Title>
							<input
								className="w-full border rounded px-3 py-2 mb-2"
								placeholder="Start typing model…"
								value={ lookupInput }
								onChange={ ( e ) =>
									setLookupInput( e.target.value )
								}
								onKeyDown={ ( e ) => {
									if ( e.key === 'Enter' ) {
										handleLookupSelect();
									}
								} }
							/>
							{ lookupInput && (
								<div className="mb-3">
									{ lookupResult ? (
										<div className="text-green-600 text-sm">
											Match found:{ ' ' }
											<span className="font-semibold">
												{ lookupResult
													.replace( /_/g, ' ' )
													.toUpperCase() }
											</span>
										</div>
									) : (
										<div className="text-red-600 text-sm">
											No match found.
										</div>
									) }
								</div>
							) }
							<div className="flex gap-2">
								<button
									type="button"
									className="flex-1 px-4 py-2 bg-yellow-400 rounded text-white font-semibold shadow hover:bg-yellow-500 transition"
									disabled={ ! lookupResult }
									onClick={ handleLookupSelect }
								>
									Select
								</button>
								<button
									type="button"
									className="flex-1 px-4 py-2 bg-gray-200 rounded font-semibold hover:bg-gray-300 transition"
									onClick={ () => setModalOpen( false ) }
								>
									Cancel
								</button>
							</div>
						</div>
					</Dialog>
				</div>
			) : (
				<div>{ stepsPlaceholder[ currentStep ] }</div>
			) }
		</div>
	);
}

createRoot( document.getElementById( 'cleverlux-root' ) ).render( <App /> );

export default App;
