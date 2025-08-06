const steps = [ 'Vehicle', 'Extras', 'Schedule', 'Confirm' ];
export default function CarProgress( { current } ) {
	return (
		<div className="flex items-center gap-2 mb-4">
			{ steps.map( ( s, i ) => (
				<div
					key={ s }
					className={ `flex-1 h-2 rounded-full ${
						i < current ? 'bg-amber-500' : 'bg-slate-200'
					}` }
				/>
			) ) }
		</div>
	);
}
