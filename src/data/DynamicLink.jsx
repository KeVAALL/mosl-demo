const tableColumns = [
  {
    Header: "SR No.",
    Cell: ({ row }) => row.index + 1, // Hardcoded serial number starting from 1
  },
  {
    Header: "Link Name",
    accessor: "dynamic_link_name",
  },
  {
    Header: "Project Name",
    accessor: "project_name",
  },
  {
    Header: "Dynamic Link",
    accessor: "link_param",
  },
  {
    Header: "Browser URL",
    accessor: "browser_url",
  },
];

const tableData = [
  {
    link_name: "push-notif",
    app_url: "https://www.webappliaction.org",
    full_url: "https://www.webappliaction.org",
    web_url: "https://www.webappliaction.org",
    open_count: 10,
  },
  {
    link_name: "push-notification",
    app_url: "https://www.webappliaction.org",
    full_url: "https://www.webappliaction.org",
    web_url: "https://www.webappliaction.org",
    open_count: 100,
  },
];
const VisibleColumn = [];

export { tableData, tableColumns, VisibleColumn };
