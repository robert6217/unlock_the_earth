import React, { useEffect, useState, useRef} from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';

const yellowPinIcon = new L.Icon({
	iconUrl: process.env.PUBLIC_URL + '/yellow-pin.png',
	iconSize: [30, 40],
	iconAnchor: [15, 40],
	popupAnchor: [0, -40],
});

function App() {
	const position = [20, 0];
	const [locations, setLocations] = useState([]);
	const mapInstanceRef = useRef(null);

	useEffect(() => {
		fetch('/api/locations') 
		.then(res => res.json())
		.then(data => setLocations(data));
	}, []);

	return (
		<div style={{ height: '100vh', width: '100%' }}>
			<MapContainer
				ref={mapInstanceRef}
				center={position}
				zoom={3}
				minZoom={2}
				maxBounds={[[-90, -180], [90, 180]]}
				maxBoundsViscosity={0.5} 
				style={{ height: '100%', width: '100%' }}
			>
				<TileLayer
					attribution='&copy; https://www.openstreetmap.org/ contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{locations.map((loc, index) => (
					<Marker key={index} position={[loc.coordinates.lat, loc.coordinates.lng]} icon={yellowPinIcon}>
						<Popup>
							<strong>{loc.name}</strong><br />
							{loc.podcast.title}<br />
							<a href={loc.podcast.url} target="_blank" rel="noopener noreferrer">
								收聽 Podcast
							</a>
						</Popup>
					</Marker>
				))}
			</MapContainer>
		</div>
	);
}

export default App;
