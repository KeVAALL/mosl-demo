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
  StyledTableCell,
} from "../../utils/ReactTable/index";
import { useSortBy } from "react-table";
import { tableColumns, tableData, VisibleColumn } from "../../data/DynamicLink";
import { CustomComponentSelect } from "../../utils/Input/customCompSelect";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { CustomSelect } from "../../utils/Input/reactSelect";
import { ApiService } from "../../utils/api/apiCall";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { HtmlLightTooltip } from "../../utils/components/Tooltip";

function DynamicLink() {
  const [open, setOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [submitForm, setSubmitForm] = useState(false);
  const [initialValues, setInitialValues] = useState({
    p_id: null,
    link_access_url: "",
    dynamic_link_name: "",
    browser_url: "",
    open_in_ios: "Browser",
    open_in_android: "Browser",
    open_in_app_ios_application_id: null,
    open_in_app_android_application_id: null,
  });
  const validationSchema = Yup.object().shape({
    p_id: Yup.object().required("Project is required"),
    link_access_url: Yup.string(),
    dynamic_link_name: Yup.string().required("Dynamic Link Name is required"),
    browser_url: Yup.string().required("Browser URL is required"),
    open_in_ios: Yup.string().required("Link behavior for IOS is required"),
    open_in_android: Yup.string().required(
      "Link behavior for Android is required"
    ),
    open_in_app_ios_application_id: Yup.object().when("open_in_ios", {
      is: (value) => value === "App",
      then: () => Yup.object().required("Please select an Application"),
      otherwise: () => Yup.object().nullable(),
    }),
    open_in_app_android_application_id: Yup.object().when("open_in_android", {
      is: (value) => value === "App",
      then: () => Yup.object().required("Please select an Application"),
      otherwise: () => Yup.object().nullable(),
    }),
  });
  const [loadingData, setLoadingData] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [projectDropdown, setProjectDropdown] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState({});
  const [formEditing, setFormEditing] = useState(false);
  const handleOpen = () => {
    // setOpen(true);
    setOpenForm(true);
  };
  const handleClose = () => {
    setOpenForm(false);
  };
  // Delete Modal
  const handleDeleteConfirmation = () => {
    setOpenDeleteModal(!openDeleteModal);
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
  async function getProjectDropdown() {
    try {
      const result = await ApiService({}, "project/getall-project");

      console.log(result);
      const newMap = result?.data?.map((project) => {
        return { label: project?.project_name, value: project?.id };
      });

      setProjectDropdown(newMap);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  const dataColumns = useMemo(
    () => [
      ...tableColumns,
      {
        Header: "Actions",
        accessor: "id",
        Cell: ({ value, row }) => {
          const [isEditing, setIsEditing] = useState(false);

          return (
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <HtmlLightTooltip title="Edit" placement="top" arrow>
                <LoadingButton
                  loading={isEditing}
                  disabled={isEditing}
                  className="mui-icon-button"
                  variant="outlined"
                  startIcon={
                    <BorderColorOutlinedIcon
                      sx={{ color: isEditing ? "transparent" : "#fff" }}
                    />
                  }
                  onClick={async () => {
                    console.log(row);
                  }}
                />
              </HtmlLightTooltip>

              <HtmlLightTooltip title="Delete" placement="top" arrow>
                <Button
                  className="mui-icon-button"
                  variant="outlined"
                  startIcon={<DeleteForeverOutlinedIcon />}
                  onClick={() => {
                    // setDeleteItem(row?.original);
                    // handleDeleteConfirmation();
                  }}
                />
              </HtmlLightTooltip>
            </Stack>
          );
        },
      },
    ],
    [tableData]
  );
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
  useEffect(() => {
    getProjectDropdown();
  }, []);

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
                <Grid item md={3} xs={6}>
                  <CustomSelect
                    placeholder="Select Project"
                    options={projectDropdown}
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
                        className="last-header-right"
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
            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                console.log(values);
              }}
            >
              {({ setFieldValue, handleSubmit, values }) => (
                <Form onSubmit={handleSubmit}>
                  <Paper elevation={3}>
                    <Box>
                      <Grid
                        container
                        spacing={2.5}
                        mt={1}
                        className="pl-20 pr-20 pb-20"
                      >
                        <Grid item md={6} className="w-full">
                          <FormControl variant="standard" fullWidth>
                            <Typography className="label d-flex items-center">
                              Project
                              <sup className="asc">*</sup>
                            </Typography>
                            <Field name="p_id">
                              {({ field }) => (
                                <CustomSelect
                                  {...field}
                                  placeholder="Select Project"
                                  options={projectDropdown}
                                  id="p_id"
                                  onChange={(option) =>
                                    setFieldValue("p_id", option)
                                  }
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="p_id"
                              component="div"
                              className="text-error text-12 mt-5"
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={6} className="w-full">
                          <FormControl variant="standard" fullWidth>
                            <Typography className="label d-flex items-center">
                              Dynamic Link Name
                              <sup className="asc">*</sup>
                            </Typography>
                            <Field name="dynamic_link_name">
                              {({ field }) => (
                                <BootstrapInput
                                  {...field}
                                  fullWidth
                                  id="dynamic_link_name"
                                  size="small"
                                  InputLabelProps={{ shrink: true }}
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="dynamic_link_name"
                              component="div"
                              className="text-error text-12 mt-5"
                            />
                          </FormControl>
                        </Grid>

                        <Grid item md={6} className="w-full">
                          <FormControl variant="standard" fullWidth>
                            <Typography className="label d-flex items-center">
                              Link Access URL
                              <sup className="asc">*</sup>
                            </Typography>

                            <Field name="deep_link_url_suffix">
                              {({ field }) => (
                                <BootstrapInput
                                  {...field}
                                  disabled
                                  fullWidth
                                  id="deep_link_url_suffix"
                                  size="small"
                                  InputLabelProps={{ shrink: true }}
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="deep_link_url_suffix"
                              component="div"
                              className="text-error text-12 mt-5"
                            />
                          </FormControl>
                        </Grid>

                        <Grid item md={6} className="w-full"></Grid>

                        <Grid item md={6} className="w-full">
                          <FormControl variant="standard" fullWidth>
                            <Typography className="label d-flex items-center">
                              Browser URL
                              <sup className="asc">*</sup>
                            </Typography>

                            <Field name="browser_url">
                              {({ field }) => (
                                <BootstrapInput
                                  {...field}
                                  fullWidth
                                  id="browser_url"
                                  size="small"
                                  // placeholder="https://page.link"
                                  InputLabelProps={{ shrink: true }}
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="browser_url"
                              component="div"
                              className="text-error text-12 mt-5"
                            />
                          </FormControl>
                        </Grid>

                        <Grid item md={6} className="w-full"></Grid>

                        <Grid item md={6} className="w-full">
                          <FormControl variant="standard" fullWidth>
                            <Typography className="label d-flex items-center">
                              Link behavior for IOS
                              <sup className="asc">*</sup>
                            </Typography>
                            <Field
                              as={RadioGroup}
                              aria-labelledby="open_in_ios"
                              name="open_in_ios"
                              defaultValue="Browser"
                            >
                              <FormControlLabel
                                value="Browser"
                                control={<Radio className="label" />}
                                label={
                                  <Typography variant="body1" className="label">
                                    Open the deep link URL in a browser
                                  </Typography>
                                }
                                sx={{ width: "55%" }}
                              />
                              <FormControlLabel
                                value="App"
                                control={<Radio className="label" />}
                                label={
                                  <Typography variant="body1" className="label">
                                    Open the deep link URL in the app
                                  </Typography>
                                }
                                sx={{ width: "55%" }}
                              />
                            </Field>

                            <Field
                              disabled={!values?.open_in_ios === "App"}
                              name="open_in_app_ios_application_id"
                            >
                              {({ field }) => (
                                <CustomSelect
                                  // {...field}
                                  isDisabled={!values?.open_in_ios === "App"}
                                  placeholder="Select Application"
                                  options={applicationArr}
                                  id="open_in_app_ios_application_id"
                                  onChange={(option) =>
                                    setFieldValue(
                                      "open_in_app_ios_application_id",
                                      option
                                    )
                                  }
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="open_in_app_ios_application_id"
                              component="div"
                              className="text-error text-12 mt-5"
                            />
                          </FormControl>
                        </Grid>

                        <Grid item md={6} className="w-full">
                          <FormControl variant="standard" fullWidth>
                            <Typography className="label d-flex items-center">
                              Link behavior for Android
                              <sup className="asc">*</sup>
                            </Typography>
                            <Field
                              as={RadioGroup}
                              aria-labelledby="open_in_android"
                              name="open_in_android"
                              defaultValue="Browser"
                            >
                              <FormControlLabel
                                value="Browser"
                                control={<Radio className="label" />}
                                label={
                                  <Typography variant="body1" className="label">
                                    Open the deep link URL in a browser
                                  </Typography>
                                }
                                sx={{ width: "55%" }}
                              />
                              <FormControlLabel
                                value="App"
                                control={<Radio className="label" />}
                                label={
                                  <Typography variant="body1" className="label">
                                    Open the deep link URL in the app
                                  </Typography>
                                }
                                sx={{ width: "55%" }}
                              />
                            </Field>

                            <Field name="open_in_app_android_application_id">
                              {({ field }) => (
                                <CustomSelect
                                  {...field}
                                  isDisabled={
                                    !values?.open_in_android === "App"
                                  }
                                  placeholder="Select Application"
                                  options={applicationArr}
                                  id="open_in_app_android_application_id"
                                  menuPlacement="auto"
                                  onChange={(option) =>
                                    setFieldValue(
                                      "open_in_app_android_application_id",
                                      option
                                    )
                                  }
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="open_in_app_android_application_id"
                              component="div"
                              className="text-error text-12 mt-5"
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Box>
                    <Box className="p-20 bg-highlight">
                      <Grid container spacing={2}>
                        <Grid item md={10} xs={2}></Grid>
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
                        <Grid item md={1} xs={5}>
                          <LoadingButton
                            loading={submitForm}
                            disabled={submitForm}
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ backgroundColor: "primary.main" }}
                          >
                            Save
                          </LoadingButton>
                        </Grid>
                      </Grid>
                    </Box>
                  </Paper>
                </Form>
              )}
            </Formik>
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default DynamicLink;

/* <Grid item md={6} className="w-full">
                          <FormControl variant="standard" fullWidth>
                            <Typography className="label d-flex items-center">
                              Dynamic Link URL
                              <sup className="asc">*</sup>
                            </Typography>
                            <Field name="link_access_url">
                              {({ field }) => (
                                <BootstrapInput
                                  {...field}
                                  fullWidth
                                  id="link_access_url"
                                  size="small"
                                  placeholder="/zyx"
                                  InputLabelProps={{ shrink: true }}
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="link_access_url"
                              component="div"
                              className="text-error text-12 mt-5"
                            />
                          </FormControl>
                        </Grid> */
/* <Grid item md={6} className="w-full">
                          <FormControl variant="standard" fullWidth>
                            <Typography className="label d-flex items-center">
                              URL Suffix
                              <sup className="asc">*</sup>
                            </Typography>

                            <Field name="deep_link_url_suffix">
                              {({ field }) => (
                                <BootstrapInput
                                  {...field}
                                  fullWidth
                                  id="deep_link_url_suffix"
                                  size="small"
                                  placeholder="/zyx"
                                  InputLabelProps={{ shrink: true }}
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="deep_link_url_suffix"
                              component="div"
                              className="text-error text-12 mt-5"
                            />
                          </FormControl>
                        </Grid> */

/* <Grid item md={12} className="w-full">
                          <Stack spacing={0.5}>
                            <Typography variant="body1" className="label">
                              Link Preview
                            </Typography>
                            <Typography
                              sx={{ fontSize: "13px", color: "text.greyLight" }}
                            >
                              https://page.link/xyz
                              {`${values?.deep_link_url_prefix}${values?.deep_link_url_suffix}`}
                            </Typography>
                          </Stack>
                        </Grid> */
