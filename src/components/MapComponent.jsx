import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});
export default function MapComponent({ geoData }) {
  return (
    <MapContainer
      center={[0, 0]}
      zoom={2}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap"
      />
      {geoData && (
        <GeoJSON
          data={geoData}
          style={(feature) => {
            switch (feature.geometry.type) {
              case "LineString":
              case "MultiLineString":
                return { color: "red" };
              case "Polygon":
              case "MultiPolygon":
                return { color: "blue", fillOpacity: 0.2 };
              default:
                return { color: "green" };
            }
          }}
        />
      )}
    </MapContainer>
  );
}
