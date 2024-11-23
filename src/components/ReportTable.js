import React, { useState } from "react";
import "./styles.css"; 

const ReportTable = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [groupBy, setGroupBy] = useState("None");
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [sortBy, setSortBy] = useState("None");
  const [sortOrder, setSortOrder] = useState("asc"); 


  // If no data, display a message
  if (!data || data.length === 0) {
    return <p>No data available to display.</p>;
  }

  const headers = Object.keys(data[0]);

  // Group data by the selected key
  const groupData = (data, groupBy) => {
    if (groupBy === "None") {
      return [{ key: "All Data", items: data }];
    }

    return Object.entries(
      data.reduce((groups, item) => {
        const key = item[groupBy] || "No Value"; 
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(item);
        return groups;
      }, {})
    ).map(([key, items]) => ({
      key,
      items,
    }));
  };

  // Sort data by the selected column and order
  const sortData = (data, sortBy, sortOrder) => {
    if (sortBy === "None") return data;

    return [...data].sort((a, b) => {
      if (a[sortBy] == null) return 1; 
      if (b[sortBy] == null) return -1;

      const compare =
        typeof a[sortBy] === "string"
          ? a[sortBy].localeCompare(b[sortBy])
          : a[sortBy] - b[sortBy];

      return sortOrder === "asc" ? compare : -compare;
    });
  };

  // Apply sorting before grouping and Group data based on the groupBy value
  const sortedData = sortData(data, sortBy, sortOrder);
  const groupedData = groupData(sortedData, groupBy);

  // Pagination logic no grouping and grouped data
  const totalPages =
    groupBy === "None"
      ? Math.ceil(data.length / rowsPerPage) // Total pages when no grouping
      : Math.ceil(groupedData.length / rowsPerPage); // Total pages when grouped

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handlePageChange = (e) => {
    setCurrentPage(Number(e.target.value));
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  // Below logic is Paginate data based on group or rows. Also Paginate rows directly if no grouping and Paginate groups if grouped
  const paginatedData =
    groupBy === "None"
      ? sortedData.slice(
          (currentPage - 1) * rowsPerPage,
          currentPage * rowsPerPage
        ) // Paginate rows directly if no grouping
      : groupedData.slice(
          (currentPage - 1) * rowsPerPage,
          currentPage * rowsPerPage
        ); 
        
  // Toggle group expansion
  const toggleGroup = (groupKey) => {
    setExpandedGroups((prev) => {
      const newExpandedGroups = new Set(prev);
      if (newExpandedGroups.has(groupKey)) {
        newExpandedGroups.delete(groupKey); // Collapse group
      } else {
        newExpandedGroups.add(groupKey); // Expand group
      }
      return newExpandedGroups;
    });
  };

  return (
    <div className="table-container">
      <div className="dropdown-wrapper">
    <div className="dropdown-container">
      <label>Group By:</label>
      <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
        <option value="None">(Show All)</option>
        {headers.map((header) => (
          <option key={header} value={header}>
            {header}
          </option>
        ))}
      </select>
    </div>

    <div className="dropdown-container">
      <label>Sort By:</label>
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="None">(No Sorting)</option>
        {headers.map((header) => (
          <option key={header} value={header}>
            {header}
          </option>
        ))}
      </select>
      <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>

    <div className="dropdown-container">
      <label>Rows per page:</label>
      <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
        <option value={5}>5 rows per page</option>
        <option value={10}>10 rows per page</option>
        <option value={20}>20 rows per page</option>
      </select>
    </div>
  </div>

      {/* Display(flat or grouped data) */}
      <table>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Render the rows for paginated data */}
          {paginatedData.map((group, groupIndex) => (
            <React.Fragment key={groupIndex}>
              {/* Render group header with expand/collapse toggle */}
              {group.items ? (
                <tr
                  className={`group-header ${
                    expandedGroups.has(group.key) ? "group-expanded" : ""
                  }`}
                  onClick={() => toggleGroup(group.key)}
                >
                  <td colSpan={headers.length}>
                    {group.key} {expandedGroups.has(group.key) ? "-" : "+"}
                  </td>
                </tr>
              ) : (
                <tr>
                  {headers.map((header, colIndex) => (
                    <td key={colIndex}>{group[header]}</td>
                  ))}
                </tr>
              )}

              {/* Render the group rows if expanded */}
              {group.items &&
                expandedGroups.has(group.key) &&
                group.items.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {headers.map((header, colIndex) => (
                      <td key={colIndex}>{row[header]}</td>
                    ))}
                  </tr>
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination-controls">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>

        {/* Dropdown for Pages */}
        <select value={currentPage} onChange={handlePageChange}>
          {[...Array(totalPages).keys()].map((page) => (
            <option key={page} value={page + 1}>
              Page {page + 1}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ReportTable;
