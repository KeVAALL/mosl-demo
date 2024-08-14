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
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  Modal,
  Paper,
  Radio,
  RadioGroup,
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
import iosIcon from "../../assets/img/ios-icon.png";
import {
  TablePagination,
  HeaderSort,
  HidingSelect,
  GlobalFilter,
} from "../../utils/ReactTable/index";
import { useSortBy } from "react-table";
import { tableColumns, tableData, VisibleColumn } from "../../data/DynamicLink";
import { CustomComponentSelect } from "../../utils/Input/customCompSelect";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { CustomSelect } from "../../utils/Input/reactSelect";

function DynamicLink() {
  const [open, setOpen] = React.useState(false);
  const [openForm, setOpenForm] = React.useState(false);
  const handleOpen = () => {
    // setOpen(true);
    setOpenForm(true);
  };
  const handleClose = () => {
    setOpenForm(false);
  };
  const applicationArr = [
    {
      label: "push-notification-6787b",
      value: "push-notification-6787b",
    },
    {
      label: "react-auth-test-175bb",
      value: "react-auth-test-175bb",
    },
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

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "1px solid #000",
    boxShadow: 24,
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
                Dynamic Links
              </Typography>
              <Typography variant="caption" sx={{ color: "text.grey", mt: 2 }}>
                Manage Links
              </Typography>
            </Grid>
            <Grid item xs={6} display="flex" justifyContent="flex-end">
              {!openForm && (
                <Button variant="contained" onClick={handleOpen}>
                  Add Link
                </Button>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {!openForm ? (
            <TableContainer component={Paper}>
              <Grid container spacing={1.5} px={2} py={2}>
                <Grid item md={2} xs={6}>
                  <GlobalFilter
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                  />
                </Grid>
                <Grid item md={3} xs={6}>
                  <CustomSelect
                    placeholder="Select Application"
                    options={applicationArr}
                    id="application"
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
              <Box sx={{ borderBottom: "1px solid #9e9e9e" }}>
                <Grid
                  container
                  spacing={2.5}
                  mt={1}
                  className="pl-20 pr-20 pb-20"
                >
                  <Grid item xs={6}>
                    <FormControl variant="standard" fullWidth>
                      <Typography className="label d-flex items-center">
                        Application
                        <sup className="asc">*</sup>
                      </Typography>
                      <CustomSelect
                        placeholder="Select Application"
                        options={applicationArr}
                        id="application"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}></Grid>
                  <Grid item xs={6}>
                    <FormControl variant="standard" fullWidth>
                      <Typography className="label d-flex items-center">
                        URL Prefix
                        <sup className="asc">*</sup>
                      </Typography>
                      <BootstrapInput
                        fullWidth
                        id="prefix"
                        size="small"
                        name="prefix"
                        placeholder="https://page.link"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl variant="standard" fullWidth>
                      <Typography className="label d-flex items-center">
                        URL Suffix
                        <sup className="asc">*</sup>
                      </Typography>
                      <BootstrapInput
                        fullWidth
                        id="suffix"
                        size="small"
                        name="suffix"
                        placeholder="/xyz"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <Stack spacing={0.5}>
                      <Typography variant="body1" className="label">
                        Link Preview
                      </Typography>
                      <Typography
                        sx={{ fontSize: "13px", color: "text.greyLight" }}
                      >
                        https://page.link/xyz
                      </Typography>
                    </Stack>
                  </Grid>

                  <Grid item xs={6}>
                    <FormControl variant="standard" fullWidth>
                      <Typography className="label d-flex items-center">
                        Deep Link URL
                        <sup className="asc">*</sup>
                      </Typography>
                      <BootstrapInput
                        fullWidth
                        id="deep-link-url"
                        size="small"
                        //   label="Project Name"
                        name="deep-link-url"
                        placeholder="/xyz"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={6}>
                    <FormControl variant="standard" fullWidth>
                      <Typography className="label d-flex items-center">
                        Dynamic Link Name
                        <sup className="asc">*</sup>
                      </Typography>
                      <BootstrapInput
                        fullWidth
                        id="deep-link-name"
                        size="small"
                        //   label="Project Name"
                        name="deep-link-name"
                        placeholder="/xyz"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={6}>
                    <FormControl variant="standard" fullWidth>
                      <Typography className="label d-flex items-center">
                        Link behavior for Apple
                        <sup className="asc">*</sup>
                      </Typography>
                      <RadioGroup
                        aria-labelledby="link-behavior"
                        defaultValue="Browser"
                        // name="radio-buttons-group"
                      >
                        <FormControlLabel
                          value="App"
                          control={<Radio className="label" />}
                          label={
                            <Typography variant="body1" className="label">
                              Open the deep link URL in a browser
                            </Typography>
                          }
                        />
                        <FormControlLabel
                          value="App"
                          control={<Radio className="label" />}
                          label={
                            <Typography variant="body1" className="label">
                              Open the deep link URL in the app
                            </Typography>
                          }
                        />
                      </RadioGroup>
                      <CustomComponentSelect
                        options={[
                          { value: "Admin", label: "Admin" },
                          { value: "Customer", label: "Customer" },
                          { value: "Admin 2", label: "Admin 2" },
                        ]}
                        menuPlacement="auto"
                        //   menuPosition="fixed"
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={6}>
                    <FormControl variant="standard" fullWidth>
                      <Typography className="label d-flex items-center">
                        Link behavior for Android
                        <sup className="asc">*</sup>
                      </Typography>
                      <RadioGroup
                        aria-labelledby="link-behavior"
                        defaultValue="Browser"
                        // name="radio-buttons-group"
                      >
                        <FormControlLabel
                          value="App"
                          control={<Radio className="label" />}
                          label={
                            <Typography variant="body1" className="label">
                              Open the deep link URL in a browser
                            </Typography>
                          }
                        />
                        <FormControlLabel
                          value="App"
                          control={<Radio className="label" />}
                          label={
                            <Typography variant="body1" className="label">
                              Open the deep link URL in the app
                            </Typography>
                          }
                        />
                      </RadioGroup>
                      <CustomComponentSelect
                        options={[
                          { value: "Admin", label: "Admin" },
                          { value: "Customer", label: "Customer" },
                          { value: "Admin 2", label: "Admin 2" },
                        ]}
                        menuPlacement="auto"
                        //   menuPosition="fixed"
                      />
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

export default DynamicLink;
