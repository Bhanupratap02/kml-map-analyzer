const DetailedTable = ({ lineLengths }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Element Type</th>
          <th>Length (km)</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(lineLengths).map(([type, length]) => (
          <tr key={type}>
            <td>{type}</td>
            <td>{length.toFixed(2)}</td>
          </tr>
        ))}{" "}
      </tbody>
    </table>
  );
};

export default DetailedTable;
