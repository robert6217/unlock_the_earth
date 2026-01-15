import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ZoomControl } from 'react-leaflet'
import './App.css';

import L from 'leaflet';

const yellowPinIcon = new L.Icon({
	iconUrl: process.env.PUBLIC_URL + '/yellow-pin.png',
	iconSize: [30, 40],
	iconAnchor: [15, 40],
	popupAnchor: [0, -40],
});

function App() {
	const position = [20, 0];
	const mapInstanceRef = useRef(null);
	const [allLocations, setAllLocations] = useState([]);
	const [filteredLocations, setFilteredLocations] = useState([]);
	const [selectedContinents, setSelectedContinents] = useState(new Set());
	const [availableContinents, setAvailableContinents] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const API_URL = '/api/locations';

		fetch(API_URL)
			.then(res => res.json())
			.then(data => {
				setAllLocations(data);
				setFilteredLocations(data);

				const continents = new Set(data.map(item => item.continent).filter(Boolean));
				setAvailableContinents([...continents]);
				setSelectedContinents(continents); // default select all
			})
			.catch(error => console.error("Error:", error))
			.finally(() => {
				setTimeout(() => {
					setIsLoading(false);
				}, 2500);
			});
	}, []);

	const handleCheckboxChange = (continent) => {
		const newSelected = new Set(selectedContinents);
		if (newSelected.has(continent)) {
			newSelected.delete(continent);
		} else {
			newSelected.add(continent);
		}
		setSelectedContinents(newSelected);

		const newFiltered = allLocations.filter(loc => newSelected.has(loc.continent));
		setFilteredLocations(newFiltered);
	};

	return (
		<div style={{ position: 'relative', height: '100vh', width: '100%' }}>
			{isLoading && (
				<div className="loading-overlay">
					<div className="earth-spinner"></div>
					<div className="loading-text">UNLOCKING THE EARTH...</div>
				</div>
			)}
			<div className={`sidebar-container ${!isLoading ? 'visible' : ''}`}>
				<div className="sidebar-header">
					<h3>解鎖地球</h3>
					<span className="subtitle">依洲別篩選</span>
				</div>
				
				<div className="filter-list">
					{availableContinents.map(continent => (
						<label key={continent} className="custom-checkbox-wrapper">
							<input 
								type="checkbox" 
								checked={selectedContinents.has(continent)} 
								onChange={() => handleCheckboxChange(continent)}
							/>
							<span className="checkmark"></span>
							<span className="label-text">{continent}</span>
						</label>
					))}
				</div>
				
				<div className="sidebar-footer">
					Showing {filteredLocations.length} locations
				</div>
			</div>
			<div className={`map-wrapper ${!isLoading ? 'visible' : ''}`}>
				<MapContainer
					ref={mapInstanceRef}
					center={position}
					zoom={3}
					minZoom={2}
					maxBounds={[[-90, -180], [90, 180]]}
					maxBoundsViscosity={0.5}
					style={{ height: '100%', width: '100%' }}
					zoomControl={false}
				>
					<TileLayer
						attribution='&copy; https://www.openstreetmap.org/ contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>

					<ZoomControl position="bottomright" />

					{filteredLocations.map((loc, index) => (
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
		</div>
	);
}

export default App;
