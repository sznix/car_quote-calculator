import vehicleModels from '../data/vehicle-models.json';

export default function useVehicleLookup( searchTerm ) {
	if ( ! searchTerm || typeof searchTerm !== 'string' ) return null;
	const term = searchTerm.trim().toLowerCase();
	if ( term.length < 2 ) return null; // Require at least 2 characters for search
	const match = vehicleModels.find( ( entry ) =>
		entry.model.toLowerCase().includes( term )
	);
	return match ? match.size : null;
}
