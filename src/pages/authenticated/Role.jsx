/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from "react";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
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
} from "@mui/material";
import { BootstrapInput } from "../../utils/Input/textfield";
// third-party
import { useTable, usePagination, useGlobalFilter } from "react-table";

// project-imports
import {
  GlobalFilter,
  TablePagination,
  HidingSelect,
  HeaderSort,
} from "../../utils/ReactTable/index";
import { useSortBy } from "react-table";
import { tableColumns, tableData, VisibleColumn } from "../../data/Role";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";

function Role() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
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
  // const StyledTableRow = styled(TableRow)(({ theme }) => ({
  //   // "&:nth-of-type(odd)": {
  //   //   backgroundColor: theme.palette.action.hover,
  //   // },
  //   // hide last border
  //   "&:last-child td, &:last-child th": {
  //     border: 0,
  //   },
  // }));

  const style = {
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

  // useEffect(() => {
  //   const handleBeforeUnload = (e) => {
  //     const customMessage =
  //       "You have unsaved changes. Are you sure you want to leave this page?";
  //     e.preventDefault();
  //     e.returnValue = customMessage;
  //     return customMessage;
  //   };
  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   return () => {
  //     console.log("Start Again");
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, []);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box
          sx={{
            ...style,
            width: {
              xs: "90%", // 90% of the viewport width for extra-small screens
              sm: "70%", // 70% of the viewport width for small screens
              md: "60%", // 60% of the viewport width for medium screens
              lg: "50%", // 50% of the viewport width for large screens
              xl: "40%", // 40% of the viewport width for extra-large screens
            },
            maxWidth: "600px", // Maximum width constraint
            margin: "0 auto", // Center the modal horizontally
          }}
        >
          <Grid container sx={{ width: "100%" }}>
            <Grid item xs={12} sx={{ width: "100%" }}>
              <Grid
                container
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Grid item sx={{ width: "100%" }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      variant="h5"
                      sx={{ color: "primary.main", fontWeight: 500 }}
                    >
                      Add Role
                    </Typography>
                    <IconButton
                      onClick={() => {
                        window.location.reload();
                      }}
                    >
                      <ClearOutlinedIcon />
                    </IconButton>
                  </Stack>
                </Grid>
                <Grid item sx={{ width: "100%" }}>
                  <Grid
                    container
                    spacing={3}
                    mt={1}
                    component="form"
                    onSubmit={() => {}}
                    noValidate
                  >
                    <Grid item xs={12} sx={{ width: "100%" }}>
                      <FormControl variant="standard" fullWidth>
                        <Typography className="label d-flex items-center">
                          Name
                          <sup className="asc">*</sup>
                        </Typography>
                        <BootstrapInput
                          fullWidth
                          id="name"
                          size="small"
                          label="Name"
                          name="name"
                          placeholder="Name"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl variant="standard" fullWidth>
                        <Typography className="label d-flex items-center">
                          Description
                          <sup className="asc">*</sup>
                        </Typography>
                        <BootstrapInput
                          fullWidth
                          id="description"
                          size="small"
                          label="Description"
                          name="description"
                          placeholder="Description"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={6}></Grid>
                    <Grid item xs={6}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 1, mb: 1, backgroundColor: "primary.main" }}
                      >
                        Add
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      <Grid container spacing={4} sx={{ width: "100%" }}>
        <Grid item xs={12}>
          <Grid container display="flex" alignItems="center">
            <Grid item xs={6}>
              <Typography variant="h5" fontWeight={500}>
                Role Management
              </Typography>
              <Typography variant="caption" sx={{ color: "text.grey", mt: 2 }}>
                Manage Roles and their Associate Menus
              </Typography>
            </Grid>
            <Grid item xs={6} display="flex" justifyContent="flex-end">
              <Button variant="contained" onClick={handleOpen}>
                Add Role
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Grid container spacing={2} px={2} py={2}>
              <Grid item md={2} xs={6}>
                <GlobalFilter
                  globalFilter={globalFilter}
                  setGlobalFilter={setGlobalFilter}
                />
              </Grid>
              <Grid
                item
                md={2}
                xs={6}
                sx={{ paddingLeft: { md: "12px !important", xs: "inherit" } }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    className="date-picker"
                    renderInput={(params) => {
                      return (
                        <BootstrapInput
                          {...params}
                          placeholder="Filter Apps by date"
                        />
                      );
                    }}
                    disableFuture
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item md={5} xs={0}></Grid>
              <Grid item md={1} display="flex" justifyContent="flex-end">
                <Tooltip title="Download PDF" placement="top" arrow>
                  <Button
                    className="mui-icon-button"
                    variant="outlined"
                    startIcon={<CloudUploadOutlinedIcon />}
                  />
                </Tooltip>
              </Grid>
              <Grid item md={2}>
                <HidingSelect
                  hiddenColumns={hiddenColumns}
                  setHiddenColumns={setHiddenColumns}
                  allColumns={allColumns}
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
                <TableBody className="table_body_main" {...getTableBodyProps()}>
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
        </Grid>
      </Grid>
    </>
  );
}

export default Role;

// {
/* <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Username</StyledTableCell>
                  <StyledTableCell>Role</StyledTableCell>
                  <StyledTableCell>Description</StyledTableCell>
                  <StyledTableCell align="right">Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tablerows.map((row) => (
                  <StyledTableRow key={row.name}>
                    <StyledTableCell component="th" scope="row">
                      {row.name}
                    </StyledTableCell>
                    <StyledTableCell>{row.role}</StyledTableCell>
                    <StyledTableCell>{row.description}</StyledTableCell>
                    <StyledTableCell align="right">
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={2}
                      >
                        <Button
                          variant="outlined"
                          startIcon={<VisibilityOutlined />}
                        >
                          View
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<BorderColorOutlinedIcon />}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<DeleteForeverOutlinedIcon />}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table> */
// }
