import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { tableColumns } from "../../data/LinkData";
import { useSelector } from "react-redux";
import {
  GlobalFilter,
  HeaderSort,
  StyledTableCell,
  TablePagination,
} from "../../utils/ReactTable";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LoadingButton } from "@mui/lab";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { ApiService } from "../../utils/api/apiCall";
import { decryptData } from "../../utils/encryption";

function LinkData() {
  const { link_id } = useParams();
  const { userProfile } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [searchingData, setSearchingData] = useState(false);

  // Table
  const dataColumns = useMemo(() => [...tableColumns], []);
  const columns = useMemo(() => dataColumns, [dataColumns]);
  const data = useMemo(() => tableData, [tableData]);
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
        pageSize: 10,
        hiddenColumns: columns
          .filter((col) => [].includes(col.accessor))
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
  const handleFormSubmit = async (values, validateForm, submitForm) => {
    const errors = await validateForm(values);
    if (Object.keys(errors).length > 0) {
      toast.error("Please fill in all required fields");
    } else {
      submitForm();
    }
  };
  const onSubmit = async (values) => {
    console.log(values);

    const reqdata = {
      startDate: dayjs(values.startDate).format("YYYY-MM-DD"),
      endDate: dayjs(values.endDate).format("YYYY-MM-DD"),
      link_id: decryptData(link_id),
    };
    // Handle form submission
    try {
      setSearchingData(true);

      const result = await ApiService(reqdata, "get-log");

      console.log(result);

      setTableData(result?.data);

      // return result;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setSearchingData(false);
    }
  };
  //   useEffect(() => {
  //     async function fetchData() {
  //       try {
  //         // Get the owner dropdown and project list first
  //       } catch (error) {
  //         console.error("Error fetching data:", error);
  //       }
  //     }

  //     fetchData();
  //   }, [project_data]); // Use project_data as dependency

  return (
    <div>
      <Grid container spacing={4} sx={{ width: "100%" }}>
        <Grid item xs={12}>
          <Grid container display="flex" alignItems="center">
            <Grid item xs={6}>
              <Typography variant="h5" fontWeight={500}>
                Link Data
              </Typography>
              {/* <Typography variant="caption" sx={{ color: "text.grey", mt: 2 }}>
                Manage Projects
              </Typography> */}
            </Grid>
            {/* <Grid item xs={6} display="flex" justifyContent="flex-end">
              {menu[1]?.add_flag ? (
                !openForm && (
                  <Button variant="contained" onClick={handleOpen}>
                    Add Project
                  </Button>
                )
              ) : (
                <></>
              )}
            </Grid> */}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Formik
              initialValues={{
                startDate: dayjs(),
                endDate: dayjs(),
              }}
              validationSchema={Yup.object().shape({
                startDate: Yup.date().required("Start Date is required"),
                endDate: Yup.date().required("End Date is required"),
              })}
              onSubmit={onSubmit}
            >
              {({ values, setFieldValue, validateForm, submitForm }) => (
                <Form>
                  <Grid container spacing={2} px={2} py={2}>
                    <Grid item md={2} xs={6}>
                      <GlobalFilter
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                      />
                    </Grid>
                    <Grid item md={2} xs={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Field name="startDate">
                          {({ field }) => (
                            <DatePicker
                              label="Start Date"
                              className="date-field"
                              value={values.startDate}
                              onChange={(newValue) => {
                                if (newValue) {
                                  setFieldValue("startDate", dayjs(newValue)); // Set the formatted date in Formik
                                } else {
                                  // Handle invalid date case if needed
                                  setFieldValue("startDate", ""); // Reset or set to empty if invalid
                                }
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  {...field}
                                  label="Start Date"
                                  placeholder="Start Date"
                                  variant="outlined"
                                  fullWidth
                                  InputLabelProps={{
                                    ...params.InputLabelProps,

                                    shrink: true, // Force the label to be in a shrunk state
                                  }}
                                />
                              )}
                              disableFuture
                            />
                          )}
                        </Field>
                      </LocalizationProvider>
                    </Grid>
                    <Grid item md={2} xs={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Field name="endDate">
                          {({ field }) => (
                            <DatePicker
                              label="End Date"
                              className="date-field"
                              value={values.endDate}
                              onChange={(newValue) => {
                                console.log(newValue);
                                if (newValue) {
                                  //   const formattedDate =
                                  //     newValue.format("YYYY-MM-DD"); // Format the date
                                  //   console.log(formattedDate);
                                  setFieldValue("endDate", dayjs(newValue)); // Set the formatted date in Formik
                                } else {
                                  // Handle invalid date case if needed
                                  setFieldValue("endDate", ""); // Reset or set to empty if invalid
                                }
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  {...field}
                                  placeholder="End Date"
                                  variant="outlined"
                                  fullWidth
                                  InputLabelProps={{
                                    shrink: true, // Force the label to be in a shrunk state
                                  }}
                                />
                              )}
                              disableFuture
                            />
                          )}
                        </Field>
                      </LocalizationProvider>
                    </Grid>
                    <Grid item md={1} xs={5}>
                      <LoadingButton
                        loading={searchingData}
                        disabled={searchingData}
                        type="button"
                        fullWidth
                        variant="contained"
                        sx={{ backgroundColor: "primary.main" }}
                        onClick={() =>
                          handleFormSubmit(values, validateForm, submitForm)
                        }
                      >
                        Search
                      </LoadingButton>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
            <Box sx={{ width: "100%", overflowX: "auto", display: "block" }}>
              <Table {...getTableProps()}>
                <TableHead>
                  {headerGroups.map((headerGroup) => (
                    <TableRow
                      className="last-header-right"
                      key={headerGroup.id}
                      {...headerGroup.getHeaderGroupProps()}
                    >
                      {headerGroup.headers.map((column) => (
                        <StyledTableCell
                          key={column.id}
                          {...column.getHeaderProps()}
                          style={{
                            minWidth: column.minWidth,
                            textAlign: column.align || "left",
                          }}
                          sx={{
                            border: "1px solid #dbe0e5a6",
                          }}
                        >
                          <HeaderSort column={column} />
                        </StyledTableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableHead>
                {loadingData ? (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={columns.length + 1} align="center">
                        <Box p={5} display="flex" justifyContent="center">
                          <CircularProgress
                            className="table_loader"
                            sx={{
                              color: "#757575",
                            }}
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ) : (
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
                                {...cell.getCellProps({})}
                                style={{
                                  minWidth: cell.column.minWidth,
                                  textAlign: cell.column.align || "left",
                                }}
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
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length + 1} align="center">
                          No Data Found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                )}
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
    </div>
  );
}

export default LinkData;
