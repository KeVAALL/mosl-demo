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

function DynamicLink() {
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 300,
          },
        }}
      >
        <Box
          sx={{
            ...modalStyle,
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
          <Grid
            container
            sx={{
              width: "100%",
              pt: 2,
              pb: 2,
              position: "fixed",
              borderBottom: "1px solid #9e9e9e",
            }}
          >
            <Grid item sx={{ width: "100%", px: 4 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  variant="h5"
                  sx={{ color: "primary.main", fontWeight: 500 }}
                >
                  Create your Dynamic Link
                </Typography>
                <IconButton
                  onClick={() => {
                    // window.location.reload();
                    handleClose();
                  }}
                >
                  <ClearOutlinedIcon />
                </IconButton>
              </Stack>
            </Grid>
          </Grid>
          <Grid
            container
            sx={{ width: "100%", height: { md: "73px", xs: "95px" } }}
          ></Grid>
          <Grid
            container
            sx={{
              width: "100%",
              px: 4,
              pb: 4,
              height: "500px",
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#f1f1f1",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#888",
                borderRadius: "10px",
                border: "2px solid #f1f1f1",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#555",
              },
            }}
          >
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
                <Grid item xs={12} sx={{ width: "100%" }}>
                  <Grid
                    container
                    spacing={3}
                    mt={1}
                    component="form"
                    onSubmit={() => {}}
                    noValidate
                  >
                    <Grid item xs={6} sx={{ width: "100%" }}>
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

                    <Grid item xs={12}>
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

                    <Grid item xs={12}>
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

                    <Grid item xs={12}>
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

                    {/* <Grid item xs={6}></Grid>
                    <Grid item xs={6}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 1, mb: 1, backgroundColor: "primary.main" }}
                      >
                        Add
                      </Button>
                    </Grid> */}
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
                Your Dynamic Links
              </Typography>
              <Typography variant="caption" sx={{ color: "text.grey", mt: 2 }}>
                Manage Links
              </Typography>
            </Grid>
            <Grid item xs={6} display="flex" justifyContent="flex-end">
              <Button variant="contained" onClick={handleOpen}>
                Add Link
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

export default DynamicLink;
