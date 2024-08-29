const tableColumns = [
  {
    Header: "Username",
    accessor: "user_name",
  },
  {
    Header: "Role",
    accessor: "role_name",
  },
  {
    Header: "Phone Number",
    accessor: "user_phone_number",
  },
  {
    Header: "Email",
    accessor: "user_email",
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
