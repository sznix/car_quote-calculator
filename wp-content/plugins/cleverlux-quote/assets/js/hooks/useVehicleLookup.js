import vehicleModels from '../data/vehicle-models.json';

export default function useVehicleLookup( searchTerm ) {
	if ( ! searchTerm ) return null;
	const term = searchTerm.trim().toLowerCase();
	const match = vehicleModels.find( ( entry ) =>
		entry.model.toLowerCase().includes( term )
	);
	return match ? match.size : null;
}
