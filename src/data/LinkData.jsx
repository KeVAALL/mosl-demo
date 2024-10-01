const tableColumns = [
  {
    Header: "SR No.",
    Cell: ({ row }) => row.index + 1, // Hardcoded serial number starting from 1
  },
  {
    Header: "Source",
    accessor: "logs_source",
  },
  {
    Header: "Dynamic Link",
    accessor: "logs_dynamic_link",
  },

  {
    Header: "Redirected to",
    accessor: "logs_redirected_to",
  },
  {
    Header: "Count",
    accessor: "count",
    minWidth: 50,
    width: 50,
    align: "right", // Add alignment property to this column
  },
];

export { tableColumns };
