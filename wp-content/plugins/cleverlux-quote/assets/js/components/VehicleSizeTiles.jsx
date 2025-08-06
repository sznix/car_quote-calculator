import React from 'react';
import { useHaptic } from '../hooks/useHaptic';

const SIZE_DATA = [
	{
		slug: 'sedan',
		label: 'Sedan',
		examples: [ 'Toyota Camry', 'Honda Accord' ],
		svg: (
			<svg viewBox="0 0 48 24" className="w-14 h-14 mx-auto" fill="none">
				<rect
					x="6"
					y="10"
					width="36"
					height="8"
					rx="2"
					fill="#E2E8F0"
				/>
				<rect
					x="12"
					y="8"
					width="24"
					height="6"
					rx="2"
					fill="#CBD5E1"
				/>
			</svg>
		),
	},
	{
		slug: 'sports',
		label: 'Sports',
		examples: [ 'Chevrolet Corvette', 'Porsche 911' ],
		svg: (
			<svg viewBox="0 0 48 24" className="w-14 h-14 mx-auto" fill="none">
				<ellipse cx="24" cy="14" rx="18" ry="6" fill="#FBBF24" />
				<rect
					x="16"
					y="8"
					width="16"
					height="4"
					rx="2"
					fill="#FDBA74"
				/>
			</svg>
		),
	},
	{
		slug: 'small_suv',
		label: 'Small SUV',
		examples: [ 'Honda CR-V', 'Subaru Forester' ],
		svg: (
			<svg viewBox="0 0 48 24" className="w-14 h-14 mx-auto" fill="none">
				<rect
					x="7"
					y="12"
					width="34"
					height="7"
					rx="2"
					fill="#A7F3D0"
				/>
				<rect
					x="14"
					y="8"
					width="20"
					height="6"
					rx="2"
					fill="#34D399"
				/>
			</svg>
		),
	},
	{
		slug: 'large_suv',
		label: 'Large SUV',
		examples: [ 'Chevrolet Tahoe', 'Toyota Sequoia' ],
		svg: (
			<svg viewBox="0 0 48 24" className="w-14 h-14 mx-auto" fill="none">
				<rect
					x="5"
					y="11"
					width="38"
					height="9"
					rx="3"
					fill="#BFDBFE"
				/>
				<rect
					x="10"
					y="8"
					width="28"
					height="7"
					rx="2"
					fill="#60A5FA"
				/>
			</svg>
		),
	},
	{
		slug: 'full_van',
		label: 'Full Van',
		examples: [ 'Mercedes Sprinter', 'Ford Transit' ],
		svg: (
			<svg viewBox="0 0 48 24" className="w-14 h-14 mx-auto" fill="none">
				<rect
					x="7"
					y="9"
					width="34"
					height="11"
					rx="2"
					fill="#DDD6FE"
				/>
				<rect
					x="18"
					y="6"
					width="14"
					height="7"
					rx="2"
					fill="#A78BFA"
				/>
			</svg>
		),
	},
	{
		slug: 'boat',
		label: 'Boat',
		examples: [ 'Bayliner Element E16', 'Yamaha AR195' ],
		svg: (
			<svg viewBox="0 0 48 24" className="w-14 h-14 mx-auto" fill="none">
				<path d="M6 18 Q24 23 42 18 Q24 21 6 18 Z" fill="#6EE7B7" />
				<rect x="20" y="9" width="8" height="5" rx="2" fill="#059669" />
			</svg>
		),
	},
];

export default function VehicleSizeTiles( { selected, onSelect } ) {
	const haptic = useHaptic();
	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-2xl mx-auto">
			{ SIZE_DATA.map( ( size ) => (
				<button
					key={ size.slug }
					type="button"
					onClick={ () => {
						onSelect( size.slug );
						haptic();
					} }
					className={ [
						'relative flex flex-col items-center border bg-white p-4 rounded-2xl shadow group focus:outline-none transition ring-2 ring-transparent',
						selected === size.slug
							? 'ring-2 ring-yellow-400'
							: 'hover:ring-2 hover:ring-yellow-300',
					].join( ' ' ) }
					aria-pressed={ selected === size.slug }
				>
					{ size.svg }
					<div className="mt-2 font-semibold text-base">
						{ size.label }
					</div>
					<div className="mt-1 text-xs text-gray-400 text-center">
						{ size.examples.join( ', ' ) }
					</div>
				</button>
			) ) }
		</div>
	);
}
