import React, { useState, useEffect, useRef } from "react";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { DEFAULT_OPTIONS, getTheme } from "@table-library/react-table-library/material-ui";
import { useSort } from "@table-library/react-table-library/sort";
import { FaSort, FaSortAlphaDown, FaSortAlphaUp, FaGripVertical } from "react-icons/fa";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { nodes } from "./data";

const ITEMS_PER_PAGE = 10;

const customTheme = {
  HeaderRow: `
    background-color: #1e3a8a;
    color: white;
    font-weight: bold;
    text-align: left;
  `,
  Row: `
    &:nth-child(even) {
      background-color: #f1f5f9;
    }
    &:hover {
      background-color: #cbd5e1;
      cursor: pointer;
    }
  `,
  BaseCell: `
    padding: 12px;
    border: 1px solid #ddd;
  `,
};

const DraggableColumn = ({ column, index, moveColumn }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "COLUMN",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "COLUMN",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveColumn(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <th
      ref={(node) => drag(drop(node))}
      title="Drag to reorder"
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
        width: "20vw",
        padding: "10px",
        backgroundColor: "#222",
        color: "white",
        border: "2px solid white",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        <FaGripVertical />
        {column.label}
      </div>
    </th>
  );
};

const Table = () => {
  const [columns, setColumns] = useState(() => {
    const storedColumns = localStorage.getItem("columnOrder");
    return storedColumns
      ? JSON.parse(storedColumns)
      : [
          { id: "name", label: "Name", sortKey: "NAME" },
          { id: "email", label: "Email", sortKey: "EMAIL" },
          { id: "status", label: "Status", sortKey: "STATUS" },
          { id: "lastLogin", label: "Last Login", sortKey: "LAST_LOGIN" },
          { id: "deals", label: "Deals", sortKey: "DEALS" },
        ];
  });

  const [page, setPage] = useState(1);
  const [data, setData] = useState(nodes.slice(0, ITEMS_PER_PAGE));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);

  
  // Function to fetch more data
  const fetchMoreData = () => {
    if (loading || !hasMore) return;
    setLoading(true);

    setTimeout(() => {
      const newPage = page + 1;
      const newRecords = nodes.slice(page * ITEMS_PER_PAGE, newPage * ITEMS_PER_PAGE);

      if (newRecords.length === 0) {
        setHasMore(false); 
      } else {
        setData((prevData) => [...prevData, ...newRecords]);
        setPage(newPage);
      }
      setLoading(false);
    }, 1000); 
  };

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMoreData();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current && document.getElementById("loading-indicator")) {
      observerRef.current.observe(document.getElementById("loading-indicator"));
    }

    return () => observerRef.current?.disconnect();
  }, [page, loading, hasMore]);

  const moveColumn = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    const updatedColumns = [...columns];
    const [movedColumn] = updatedColumns.splice(fromIndex, 1);
    updatedColumns.splice(toIndex, 0, movedColumn);
    setColumns(updatedColumns);
    localStorage.setItem("columnOrder", JSON.stringify(updatedColumns));
  };

  const materialTheme = getTheme(DEFAULT_OPTIONS);
  const theme = useTheme([materialTheme, customTheme]);

  const sort = useSort(
    { nodes: data },
    { onChange: onSortChange },
    {
      sortIcon: {
        iconDefault: <FaSort />,
        iconUp: <FaSortAlphaUp />,
        iconDown: <FaSortAlphaDown />,
      },
      sortFns: {
        NAME: (array) => array.sort((a, b) => a.name.localeCompare(b.name)),
        EMAIL: (array) => array.sort((a, b) => a.email.localeCompare(b.email)),
        STATUS: (array) => array.sort((a, b) => a.status.localeCompare(b.status)),
        LAST_LOGIN: (array) => array.sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin)),
        DEALS: (array) => array.sort((a, b) => a.deals - b.deals),
      },
    }
  );

  function onSortChange(action, state) {
    console.log(action, state);
  }

  const COLUMNS = columns.map((col) => ({
    label: col.label,
    renderCell: (item) => {
      if (col.id === "status") {
        return (
          <span
            style={{
              backgroundColor:
                item.status === "Active"
                  ? "rgba(31, 224, 31, 0.7)"
                  : item.status === "Inactive"
                  ? "rgba(255, 29, 29, 0.7)"
                  : "yellow",
              padding: "3px 8px",
              borderRadius: "10px",
            }}
          >
            {item.status}
          </span>
        );
      }
      if (col.id === "lastLogin") {
        return item.lastLogin
          ? new Date(item.lastLogin).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Never";
      }
      return item[col.id];
    },
    sort: { sortKey: col.sortKey },
  }));

  return (
    <DndProvider backend={HTML5Backend}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <DraggableColumn key={col.id} column={col} index={index} moveColumn={moveColumn} />
            ))}
          </tr>
        </thead>
      </table>
      <CompactTable columns={COLUMNS} data={{ nodes: data }} sort={sort} theme={theme} />
      <div id="loading-indicator" style={{ textAlign: "center", padding: "20px" }}>
        {loading && <span>Loading more records...</span>}
        {!hasMore && <span>No more records found</span>}
      </div>
    </DndProvider>
  );
};

export default Table;
