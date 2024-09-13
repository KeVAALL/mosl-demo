const tableColumns = [
  {
    Header: "SR No.",
    Cell: ({ row }) => row.index + 1, // Hardcoded serial number starting from 1
  },
  {
    Header: "Role",
    accessor: "role_name",
  },
];

const tableData = [
  {
    name: "Keval",
    role: "Administrator",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ac metus tortor. Nunc odio lacus, placerat at tellus ac, feugiat",
  },
  {
    name: "Akshay",
    role: "Administrator",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ac metus tortor. Nunc odio lacus, placerat at tellus ac, feugiat",
  },
  {
    name: "Toufiq",
    role: "Administrator",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ac metus tortor. Nunc odio lacus, placerat at tellus ac, feugiat",
  },
];
const VisibleColumn = [];

export { tableData, tableColumns, VisibleColumn };
