const tableColumns = [
  {
    Header: "Application name",
    accessor: "package_name",
  },
  {
    Header: "Platform",
    accessor: "platform",
  },
  {
    Header: "Dynamic URL",
    accessor: "dynamic_url",
  },
  {
    Header: "Store URL",
    accessor: "store_url",
  },
  {
    Header: "Description",
    accessor: "description",
    minWidth: 250,
  },
];

const tableData = [
  {
    app_nickname: "push-notif",
    app_id: "1:181960348200:web:77424b9db7e691df44db1d",
  },
  {
    app_nickname: "push-notification",
    app_id: "1:181960348200:web:77424b9db7e691df44db1d",
  },
];
const VisibleColumn = [];

export { tableData, tableColumns, VisibleColumn };
