import { useState } from "react";
import { kml } from "@tmcw/togeojson";
import { length } from "@turf/turf";
import MapComponent from "./components/MapComponent";
import SummaryTable from "./components/SummaryTable";
import DetailedTable from "./components/DetailedTable";
const KML_ELEMENT_TYPES = [
  "Placemark",
  "Point",
  "LineString",
  "Polygon",
  "MultiGeometry",
  "Folder",
  "GroundOverlay",
  "ScreenOverlay",
];
const App = () => {
  const [geoData, setGeoData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [lineLengths, setLineLengths] = useState({
    LineString: 0,
    MultiLineString: 0,
  });
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState(null);
  const handleFileUpload = (e) => {
    setError(null);
    setSummary(null);
    setLineLengths({
      LineString: 0,
      MultiLineString: 0,
    });
    setViewMode(null);

    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const kmlText = event.target.result;
        const parsedKml = kml(
          new DOMParser().parseFromString(kmlText, "text/xml")
        );
        if (!parsedKml.features?.length) {
          throw new Error("No geographic features found in KML file");
        }
        setGeoData(parsedKml);
      } catch (error) {
        setError(error?.message || "Error parsing KML file");
      }
    };
    reader.onerror = () => {
      setError("Error reading file");
    };
    reader.readAsText(file);
  };
  const handleSummary = () => {
    if (!geoData) {
      setError("Please upload a KML file first");
      return;
    }
    const counts = Object.fromEntries(
      KML_ELEMENT_TYPES.map((type) => [type, 0])
    );
    try {
      geoData?.features?.forEach((feature) => {
        const type = feature?.geometry?.type || "Placemark";
        if (!counts[type]) counts[type] = 0;
        counts[type]++;
      });
      setSummary(counts);
      setViewMode("summary");
      setError(null);
    } catch (error) {
      setError("Error generating summary");
    }
  };
  const handleDetailed = () => {
    if (!geoData) {
      setError("Please upload a KML file first");
      return;
    }
    try {
      const lengths = {
        LineString: 0,
        MultiLineString: 0,
      };
      geoData?.features.forEach((feature) => {
        const type = feature?.geometry?.type;
        if (type === "LineString" || type === "MultiLineString") {
          const line = { type: "Feature", geometry: feature.geometry };
          lengths[type] += length(line, { units: "kilometers" });
        }
      });

      setLineLengths(lengths);
      setViewMode("detailed");
      setError(null);
    } catch (error) {
      setError("Error calculating line lengths");
    }
  };
  return (
    <div className="container">
      <header className="header">
        <h1>KML Map Analyzer</h1>
        <p>Upload a KML file to visualize and analyze geographic data</p>
      </header>
      <div className="upload-section">
        {" "}
        <input
          type="file"
          accept=".kml"
          onChange={handleFileUpload}
          style={{ display: "block", margin: "0 auto" }}
        />
        <div className="button-group">
          <button onClick={handleSummary}>Summary</button>
          <button onClick={handleDetailed}>Detailed</button>
        </div>
        {error && <div className="error">{error}</div>}
        {viewMode === "summary" && summary && (
          <SummaryTable summary={summary} elementTypes={KML_ELEMENT_TYPES} />
        )}
        {viewMode === "detailed" && <DetailedTable lineLengths={lineLengths} />}
      </div>
      <div className="map-container">
        <MapComponent geoData={geoData} />
      </div>
    </div>
  );
};
export default App;
