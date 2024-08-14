const tableColumns = [
  {
    Header: "Link Name",
    accessor: "link_name",
  },
  {
    Header: "URL",
    accessor: "app_url",
  },
  {
    Header: "Full URL",
    accessor: "full_url",
  },
  {
    Header: "Web URL",
    accessor: "web_url",
  },
  {
    Header: "Open Count",
    accessor: "open_count",
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
