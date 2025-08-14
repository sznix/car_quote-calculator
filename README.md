# Vehicle Model Mapping System

A scalable, configurable, and maintainable vehicle model mapping system that follows best practices for enterprise applications.

## Features

- **Multi-source Data Support**: JSON, API, and Database data sources
- **Intelligent Caching**: Configurable cache with TTL support
- **Data Validation**: Comprehensive validation with sanitization
- **RESTful API**: Full API layer with health monitoring
- **Logging & Monitoring**: Structured logging with performance tracking
- **Configuration Management**: Environment-based configuration
- **Error Handling**: Robust error handling and recovery
- **Testing**: Comprehensive test coverage

## Architecture

```
src/
├── config/
│   └── vehicle-config.js          # Centralized configuration
├── services/
│   └── vehicle-data-service.js    # Core business logic
├── utils/
│   ├── vehicle-validator.js       # Data validation
│   └── logger.js                  # Logging utility
├── api/
│   └── vehicle-api.js             # REST API endpoints
└── assets/js/data/
    └── vehicle-models.json        # Vehicle data
```

## Quick Start

### Installation

```bash
npm install
```

### Configuration

Set environment variables (optional):

```bash
# Data source configuration
VEHICLE_DATA_SOURCE=json                    # json, api, database
VEHICLE_DATA_PATH=./assets/js/data/vehicle-models.json
VEHICLE_API_URL=https://api.example.com/vehicles

# Caching configuration
VEHICLE_CACHE_ENABLED=true
VEHICLE_CACHE_TTL=3600

# Logging configuration
VEHICLE_LOGGING_ENABLED=true
VEHICLE_LOG_LEVEL=info
```

### Running Tests

```bash
npm test
```

## API Endpoints

### Get All Vehicles
```
GET /api/vehicles
GET /api/vehicles?refresh=true
```

### Get Vehicles by Size
```
GET /api/vehicles/size/:size
```

### Get Vehicles by Make
```
GET /api/vehicles/make/:make
```

### Search Vehicles
```
GET /api/vehicles/search?make=Toyota&size=sedan
```

### Get Statistics
```
GET /api/vehicles/stats
```

### Health Check
```
GET /api/health
```

### Clear Cache
```
POST /api/vehicles/cache/clear
```

## Usage Examples

### Basic Service Usage

```javascript
import VehicleDataService from './src/services/vehicle-data-service.js';

const service = new VehicleDataService();

// Get all vehicles
const vehicles = await service.getAllVehicles();

// Get vehicles by size
const sedans = await service.getVehiclesBySize('sedan');

// Search vehicles
const results = await service.searchVehicles({ 
  make: 'Toyota', 
  size: 'sedan' 
});
```

### API Usage

```javascript
import VehicleAPI from './src/api/vehicle-api.js';

const api = new VehicleAPI();

// Mock request/response objects
const req = { query: {}, params: {} };
const res = {
  json: (data) => console.log(data),
  status: (code) => ({ json: (data) => console.log(data) })
};

// Get all vehicles
await api.getAllVehicles(req, res);
```

## Configuration Options

### Data Source Types

1. **JSON** (default): Load from local JSON file
2. **API**: Load from external API endpoint
3. **Database**: Load from database (future implementation)

### Vehicle Size Categories

- `sedan`: Standard passenger cars
- `sports`: High-performance vehicles
- `small_suv`: Compact SUVs
- `large_suv`: Full-size SUVs
- `full_van`: Commercial vans
- `boat`: Watercraft

### Validation Rules

- Required fields: `make`, `model`, `size`
- Maximum lengths: `make` (50 chars), `model` (50 chars)
- Allowed sizes: Configurable list
- Character validation: Prevents invalid characters

## Best Practices Implemented

### 1. **No Hardcoding**
- All configuration externalized to environment variables
- Data source abstraction allows easy switching
- Validation rules configurable
- Size categories extensible

### 2. **Scalability**
- Caching layer reduces data source load
- Service layer abstraction
- API rate limiting ready
- Database integration prepared
- Horizontal scaling support

### 3. **Maintainability**
- Clear separation of concerns
- Comprehensive logging
- Error handling and recovery
- Configuration management
- Test coverage

### 4. **Performance**
- Intelligent caching with TTL
- Lazy loading of data
- Efficient filtering and search
- Performance monitoring

### 5. **Security**
- Input validation and sanitization
- Error message sanitization
- No sensitive data exposure
- API security ready

## Development

### Adding New Vehicle Sizes

1. Update `VEHICLE_CONFIG.validation.allowedSizes`
2. Add size category to `VEHICLE_CONFIG.sizeCategories`
3. Update tests
4. Update documentation

### Adding New Data Sources

1. Implement new method in `VehicleDataService`
2. Update `loadFromDataSource()` method
3. Add configuration options
4. Update tests

### Extending Validation

1. Update `VehicleDataValidator` class
2. Add new validation methods
3. Update configuration
4. Add tests

## Testing

Run the test suite:

```bash
npm test
```

Test coverage includes:
- Data integrity validation
- Service functionality
- Caching behavior
- Error handling
- Configuration validation
- Performance benchmarks

## Monitoring

The system provides:
- Health check endpoints
- Performance metrics
- Cache statistics
- Error logging
- Request/response logging

## Future Enhancements

- Database integration (PostgreSQL, MongoDB)
- Redis caching
- API rate limiting
- Authentication/Authorization
- GraphQL support
- Real-time updates
- Data versioning
- Backup and recovery

## Contributing

1. Follow the existing code structure
2. Add tests for new features
3. Update documentation
4. Follow error handling patterns
5. Use the logging system

## License

MIT License
