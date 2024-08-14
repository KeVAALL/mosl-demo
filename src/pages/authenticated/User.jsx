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
  InputAdornment,
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
// third-party

// project-imports
import { BootstrapInput } from "../../utils/Input/textfield";
import { CustomSelect } from "../../utils/Input/reactSelect";
import {
  GlobalFilter,
  TablePagination,
  HidingSelect,
  HeaderSort,
} from "../../utils/ReactTable/index";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import { useSortBy } from "react-table";
import { tableColumns, tableData, VisibleColumn } from "../../data/Role";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function User() {
  const [open, setOpen] = React.useState(false);
  const [openForm, setOpenForm] = useState(false);
  const handleOpen = () => {
    // setOpen(true);
    setOpenForm(true);
  };
  const handleClose = () => {
    // setOpen(false);
    setOpenForm(false);
  };
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const options = [
    { value: "Admin", label: "Admin" },
    { value: "Customer", label: "Customer" },
    { value: "Admin 2", label: "Admin 2" },
  ];
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

  return (
    <>
      <Grid container spacing={4} sx={{ width: "100%" }}>
        <Grid item xs={12}>
          <Grid container display="flex" alignItems="center">
            <Grid item xs={6}>
              <Typography variant="h5" fontWeight={500}>
                User Management
              </Typography>
              <Typography variant="caption" sx={{ color: "text.grey", mt: 2 }}>
                Manage Users
              </Typography>
            </Grid>
            <Grid item xs={6} display="flex" justifyContent="flex-end">
              {!openForm && (
                <Button variant="contained" onClick={handleOpen}>
                  Add User
                </Button>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {!openForm ? (
            <TableContainer component={Paper}>
              <Grid container spacing={2} px={2} py={2}>
                <Grid item md={2} xs={6}>
                  <GlobalFilter
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                  />
                </Grid>
                {/* <Grid
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
                </Grid> */}
                {/* <Grid item md={5} xs={0}></Grid>
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
                </Grid> */}
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
              <Box sx={{ borderBottom: "1px solid #9e9e9e" }}>
                <Grid
                  container
                  spacing={2.5}
                  mt={1}
                  className="pl-20 pr-20 pb-20"
                >
                  <Grid item xs={4}>
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
                  <Grid item xs={4}>
                    <FormControl variant="standard" fullWidth>
                      <Typography className="label d-flex items-center">
                        Email
                        <sup className="asc">*</sup>
                      </Typography>
                      <BootstrapInput
                        fullWidth
                        id="email"
                        size="small"
                        label="Email"
                        name="email"
                        placeholder="Email"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl variant="standard" fullWidth>
                      <Typography className="label d-flex items-center">
                        Password
                        <sup className="asc">*</sup>
                      </Typography>
                      <BootstrapInput
                        fullWidth
                        id="password"
                        type={showPassword ? "text" : "password"}
                        size="small"
                        label="Password"
                        name="password"
                        placeholder="Password"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              onMouseUp={handleMouseDownPassword}
                              edge="end"
                              color="text.greyLight"
                            >
                              {showPassword ? (
                                <Visibility
                                  fontSize="small"
                                  color="text.greyLight"
                                />
                              ) : (
                                <VisibilityOff fontSize="small" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl variant="standard" fullWidth>
                      <Typography className="label d-flex items-center">
                        Phone Number
                        <sup className="asc">*</sup>
                      </Typography>
                      <BootstrapInput
                        fullWidth
                        id="phone_number"
                        size="small"
                        label="Phone Number"
                        name="phone_number"
                        placeholder="Phone Number"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl variant="standard" fullWidth>
                      <Typography className="label d-flex items-center">
                        Role
                        <sup className="asc">*</sup>
                      </Typography>
                      <CustomSelect options={options} id="role" />
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
              <Box className="p-20">
                <Grid container spacing={3}>
                  <Grid item xs={9}></Grid>
                  <Grid item xs={1}>
                    <Button
                      fullWidth
                      variant="outlined"
                      sx={{ backgroundColor: "primary.main" }}
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item xs={2}>
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

export default User;
