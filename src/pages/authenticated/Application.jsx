/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from "react";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { styled } from "@mui/material/styles";
import {
  Backdrop,
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Modal,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AdbOutlinedIcon from "@mui/icons-material/AdbOutlined";
import CodeOffOutlinedIcon from "@mui/icons-material/CodeOffOutlined";
import AirplayOutlinedIcon from "@mui/icons-material/AirplayOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { CustomSelect } from "../../utils/Input/reactSelect";
// third-party
import { useTable, usePagination, useGlobalFilter } from "react-table";

// project-imports
import {
  TablePagination,
  HeaderSort,
  GlobalFilter,
  HidingSelect,
} from "../../utils/ReactTable/index";
import { useSortBy } from "react-table";
import { tableColumns, tableData, VisibleColumn } from "../../data/Application";
// import AndroidStepper from "../../section/Application/AndroidStepper";
import AndroidModal from "../../section/Application/AndroidModal";
import IOSModal from "../../section/Application/IOSModal";
import WebAppModal from "../../section/Application/WebAppModal";
import { BootstrapInput } from "../../utils/Input/textfield";

function Application() {
  const [open, setOpen] = React.useState(false);
  const [openAndroid, setOpenAndroid] = React.useState(false);
  const [openIOS, setOpenIOS] = React.useState(false);
  const [openWeb, setOpenWeb] = React.useState(false);
  const [openForm, setOpenForm] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const handleOpen = () => {
    // setOpen(true);
    setOpenForm(true);
  };
  const handleClose = () => {
    // setOpen(false);
    setOpenForm(false);
  };
  const handleAndroidOpen = () => {
    setOpenAndroid(true);
  };
  const handleAndroidClose = () => {
    setOpenAndroid(false);
  };
  const handleIOSOpen = () => {
    setOpenIOS(true);
  };
  const handleIOSClose = () => {
    setOpenIOS(false);
  };
  const handleWebOpen = () => {
    setOpenWeb(true);
  };
  const handleWebClose = () => {
    setOpenWeb(false);
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
      fontSize: 14,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 13,
    },
  }));
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "1px solid #000",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };
  const applicationArr = [
    {
      label: "Android",
      value: "Android",
    },
    {
      label: "IOS",
      value: "IOS",
    },
    {
      label: "Web App",
      value: "Web App",
    },
  ];
  const projectArr = [
    {
      label: "push-notification-6787b",
      value: "push-notification-6787b",
    },
    {
      label: "react-auth-test-175bb",
      value: "react-auth-test-175bb",
    },
  ];
  const [selectedApp, setSelectedApp] = useState({
    label: "Android",
    value: "Android",
  });
  const columns = useMemo(() => tableColumns, []);
  const data = useMemo(() => tableData, []);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    gotoPage,
    setPageSize,
    preGlobalFilteredRows,
    setGlobalFilter,
    setHiddenColumns,
    allColumns,
    state: { pageIndex, pageSize, globalFilter, hiddenColumns },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: 5,
        hiddenColumns: columns
          .filter((col) => VisibleColumn.includes(col.accessor))
          .map((col) => col.accessor),
        // filters: [{ id: "status", value: "" }],
      },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );
  let headers = [];
  allColumns.map((item) => {
    if (!hiddenColumns?.includes(item.id)) {
      headers.push({ label: item.Header, key: item.id });
    }
    return item;
  });

  return (
    <>
      <Grid container spacing={4} sx={{ width: "100%" }}>
        <Grid item xs={12}>
          <Grid container display="flex" alignItems="center">
            <Grid item xs={6}>
              <Typography variant="h5" fontWeight={500}>
                Applications
              </Typography>
              <Typography variant="caption" sx={{ color: "text.grey", mt: 2 }}>
                Manage Applications
              </Typography>
            </Grid>
            <Grid item xs={6} display="flex" justifyContent="flex-end">
              {!openForm && (
                <Button variant="contained" onClick={handleOpen}>
                  Add Application
                </Button>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {!openForm ? (
            <TableContainer component={Paper}>
              <Grid container spacing={1} px={2} py={2}>
                <Grid item md={2} xs={6}>
                  <GlobalFilter
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                  />
                </Grid>
                <Grid item md={3} xs={6}>
                  <CustomSelect
                    placeholder="Select Project"
                    options={projectArr}
                    id="project"
                    isClearable
                  />
                </Grid>
              </Grid>
              <Box sx={{ width: "100%", overflowX: "auto", display: "block" }}>
                <Table {...getTableProps()}>
                  <TableHead>
                    {headerGroups.map((headerGroup) => (
                      <TableRow
                        key={headerGroup.id}
                        {...headerGroup.getHeaderGroupProps()}
                      >
                        {headerGroup.headers.map((column) => (
                          <StyledTableCell
                            key={column.id}
                            {...column.getHeaderProps({
                              style: { minWidth: column.minWidth },
                            })}
                            sx={{
                              border: "1px solid #dbe0e5a6",
                            }}
                          >
                            <HeaderSort column={column} />
                          </StyledTableCell>
                        ))}
                        <StyledTableCell
                          sx={{
                            textAlign: "right",
                          }}
                        >
                          Actions
                        </StyledTableCell>
                      </TableRow>
                    ))}
                  </TableHead>
                  <TableBody
                    className="table_body_main"
                    {...getTableBodyProps()}
                  >
                    {page.length > 0 ? (
                      page.map((row) => {
                        prepareRow(row);
                        return (
                          <TableRow key={row.id} {...row.getRowProps()}>
                            {row.cells.map((cell) => (
                              <StyledTableCell
                                key={cell.column.id}
                                {...cell.getCellProps({
                                  style: { minWidth: cell.column.minWidth },
                                })}
                                sx={{
                                  border: "1px solid #dbe0e5a6",
                                }}
                              >
                                {cell.column.customCell ? (
                                  <cell.column.customCell value={cell.value} />
                                ) : (
                                  cell.render("Cell")
                                )}
                              </StyledTableCell>
                            ))}
                            <StyledTableCell align="right">
                              <Stack
                                direction="row"
                                justifyContent="flex-end"
                                spacing={2}
                              >
                                <Tooltip title="View" placement="top" arrow>
                                  <Button
                                    className="mui-icon-button"
                                    variant="outlined"
                                    startIcon={<VisibilityOutlined />}
                                  />
                                </Tooltip>
                                <Tooltip title="Edit" placement="top" arrow>
                                  <Button
                                    className="mui-icon-button"
                                    variant="outlined"
                                    startIcon={<BorderColorOutlinedIcon />}
                                  />
                                </Tooltip>
                                <Tooltip title="Delete" placement="top" arrow>
                                  <Button
                                    className="mui-icon-button"
                                    variant="outlined"
                                    startIcon={<DeleteForeverOutlinedIcon />}
                                  />
                                </Tooltip>
                              </Stack>
                            </StyledTableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length + 1} align="center">
                          No Data
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
              <Box sx={{ p: 2, borderTop: "1px solid #dbe0e5a6" }}>
                <TablePagination
                  gotoPage={gotoPage}
                  rows={data}
                  setPageSize={setPageSize}
                  pageIndex={pageIndex}
                  pageSize={pageSize}
                />
              </Box>
            </TableContainer>
          ) : (
            <Paper elevation={3}>
              <Box>
                <Grid container spacing={2.5} mt={1} className="pl-20 pr-20">
                  <Grid item md={4} sx={{ pb: 2.5 }} className="w-full">
                    <FormControl variant="standard" fullWidth>
                      <Typography className="label d-flex items-center">
                        Platform
                        <sup className="asc">*</sup>
                      </Typography>
                      <CustomSelect
                        placeholder="Select Application"
                        options={applicationArr}
                        value={selectedApp}
                        onChange={(e) => {
                          setSelectedApp(e);
                        }}
                        id="application"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sx={{ pb: 2.5 }} className="w-full">
                    <FormControl variant="standard" fullWidth>
                      <Typography className="label d-flex items-center">
                        Project
                        <sup className="asc">*</sup>
                      </Typography>
                      <CustomSelect
                        placeholder="Select Project"
                        options={projectArr}
                        id="project"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={12} className="w-full">
                    <Divider textAlign="left">
                      {selectedApp?.value?.toUpperCase()}
                    </Divider>
                  </Grid>
                  {/* {selectedApp?.value === "Android" && ( */}
                  <Grid item md={12} className="w-full">
                    <Box sx={{ borderBottom: "1px solid #9e9e9e" }}>
                      <Grid container sx={{ pt: 2.5, pb: 5 }}>
                        <Grid item md={4} className="pr-24 w-full">
                          <FormControl variant="standard" fullWidth>
                            <Typography className="label d-flex items-center">
                              Package Name
                              <sup className="asc">*</sup>
                            </Typography>
                            <BootstrapInput
                              fullWidth
                              id="name"
                              size="small"
                              label="Name"
                              name="name"
                              placeholder="Name"
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={8} className="w-full">
                          <FormControl variant="standard" fullWidth>
                            <Typography className="label d-flex items-center">
                              Description
                              <sup className="asc">*</sup>
                            </Typography>
                            <BootstrapInput
                              fullWidth
                              id="description"
                              size="small"
                              name="description"
                              placeholder="Description"
                            />
                          </FormControl>
                        </Grid>

                        <Grid item md={4} className="pt-24 pr-24 w-full">
                          <FormControl variant="standard" fullWidth>
                            <Typography className="label d-flex items-center">
                              Bundle ID
                              <sup className="asc">*</sup>
                            </Typography>
                            <BootstrapInput
                              fullWidth
                              id="bundle-id"
                              size="small"
                              name="bundle-id"
                              placeholder="Bundle ID"
                            />
                          </FormControl>
                        </Grid>

                        <Grid item md={4} className="pt-24 pr-24 w-full">
                          <FormControl variant="standard" fullWidth>
                            <Typography className="label d-flex items-center">
                              Store URL
                              <sup className="asc">*</sup>
                            </Typography>
                            <BootstrapInput
                              fullWidth
                              id="store-url"
                              size="small"
                              name="store-url"
                              placeholder="Store URL"
                            />
                          </FormControl>
                        </Grid>

                        <Grid item md={4} className="pt-24 w-full">
                          <FormControl variant="standard" fullWidth>
                            <Typography className="label d-flex items-center">
                              Dynamic URL
                              <sup className="asc">*</sup>
                            </Typography>
                            <BootstrapInput
                              fullWidth
                              id="dynamic-url"
                              size="small"
                              name="dynamic-url"
                              placeholder="Dynamic URL"
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                  {/* )} */}
                  {/* {selectedApp?.value === "IOS" && (
                    <Grid item xs={12}>
                      <Box sx={{ borderBottom: "1px solid #9e9e9e" }}>
                        <Grid
                          container
                          sx={{ pt: 2.5, pb: 5 }}
                          // className="p-20"
                        >
                          <Grid item xs={4} className="pr-24">
                            <FormControl variant="standard" fullWidth>
                              <Typography className="label d-flex items-center">
                                Apple bundle ID
                                <sup className="asc">*</sup>
                              </Typography>
                              <BootstrapInput
                                fullWidth
                                id="name"
                                size="small"
                                label="Name"
                                name="name"
                                placeholder="com.app"
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={4} className="pr-24">
                            <FormControl variant="standard" fullWidth>
                              <Typography className="label d-flex items-center">
                                App Description
                                <sup className="asc">*</sup>
                              </Typography>
                              <BootstrapInput
                                fullWidth
                                id="description"
                                size="small"
                                name="description"
                                placeholder="Description"
                              />
                            </FormControl>
                          </Grid>

                          <Grid item xs={4}>
                            <FormControl variant="standard" fullWidth>
                              <Typography className="label d-flex items-center">
                                App Store ID
                                <sup className="asc">*</sup>
                              </Typography>
                              <BootstrapInput
                                fullWidth
                                id="certificate"
                                size="small"
                                name="certificate"
                                placeholder="999999999"
                              />
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  )}
                  {selectedApp?.value === "Web App" && (
                    <Grid item xs={12}>
                      <Box sx={{ borderBottom: "1px solid #9e9e9e" }}>
                        <Grid
                          container
                          sx={{ pt: 2.5, pb: 5 }}
                          // className="p-20"
                        >
                          <Grid item xs={4}>
                            <FormControl variant="standard" fullWidth>
                              <Typography className="label d-flex items-center">
                                App Nickname
                                <sup className="asc">*</sup>
                              </Typography>
                              <BootstrapInput
                                fullWidth
                                id="nickname"
                                size="small"
                                name="nickname"
                                placeholder="My Android App"
                              />
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  )} */}
                </Grid>
              </Box>
              <Box className="p-20">
                <Grid container spacing={3}>
                  <Grid item md={9} xs={2}></Grid>
                  <Grid item md={1} xs={5}>
                    <Button
                      fullWidth
                      variant="outlined"
                      sx={{ backgroundColor: "primary.main" }}
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item md={2} xs={5}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ backgroundColor: "primary.main" }}
                      onClick={handleClose}
                    >
                      Save
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default Application;
