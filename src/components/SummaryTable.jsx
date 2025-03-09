const SummaryTable = ({ summary, elementTypes }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Element</th>
          <th>Count</th>
        </tr>
      </thead>
      <tbody>
        {elementTypes.map((type) => (
          <tr key={type}>
            <td>{type}</td>
            <td>{summary[type] || 0}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SummaryTable