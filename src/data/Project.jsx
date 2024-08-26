const tableColumns = [
  {
    Header: "Project name",
    accessor: "project_name",
  },
  {
    Header: "Project ID",
    accessor: "project_id",
  },
  {
    Header: "Description",
    accessor: "project_description",
  },
  {
    Header: "Owner",
    accessor: "owner",
  },
];

const tableData = [
  {
    project_name: "react-auth-test",
    project_id: "react-auth-test-175bb",
    api_key: "AIzaSyC39fWhbRWKCuAJQ13IO71xtAIG3XYMtYo",
    owner: "Admin",
  },
  {
    project_name: "push-notification",
    project_id: "push-notification-6787b",
    api_key: "No web API key for this project",
    owner: "Admin",
  },
];
const VisibleColumn = [];

export { tableData, tableColumns, VisibleColumn };
