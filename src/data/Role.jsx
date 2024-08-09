const tableColumns = [
  {
    Header: "Username",
    accessor: "name",
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Description",
    accessor: "description",
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
