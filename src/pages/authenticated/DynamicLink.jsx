/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from "react";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import { styled } from "@mui/material/styles";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
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
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
// third-party
import { useTable, usePagination, useGlobalFilter } from "react-table";

// project-imports
import {
  TablePagination,
  HeaderSort,
  GlobalFilter,
  StyledTableCell,
} from "../../utils/ReactTable/index";
import { BootstrapInput } from "../../utils/Input/textfield";
import { useSortBy } from "react-table";
import { tableColumns, VisibleColumn } from "../../data/DynamicLink";
import { CustomSelect } from "../../utils/Input/reactSelect";
import { ApiService } from "../../utils/api/apiCall";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { HtmlLightTooltip } from "../../utils/components/Tooltip";
import { useSelector } from "react-redux";
import { debounce } from "lodash";

function DynamicLink() {
  const { userProfile } = useSelector((state) => state.user);
  const { menu } = useSelector((state) => state.menu);
  const [open, setOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [submitForm, setSubmitForm] = useState(false);
  const [initialValues, setInitialValues] = useState({
    project_id: null,
    dynamic_link_name: "",
    link_param: "",
    custom_dynamic_link: "",
    browser_url: "",
    open_in_ios: "",
    open_in_android: "",
    open_in_app_ios_application_id: null,
    open_in_app_android_application_id: null,
  });
  const validationSchema = Yup.object().shape({
    project_id: Yup.object().required("Project is required"),
    dynamic_link_name: Yup.string().required("Dynamic Link Name is required"),
    link_param: Yup.string().required("Link Access URL is required"),
    custom_dynamic_link: Yup.string()
      .nullable()
      .test(
        "is-valid-length",
        "Custom Dynamic Link must be at least 20 characters",
        (value) => !value || value.length >= 20
      ),
    browser_url: Yup.string()
      .url("Please enter a valid URL")
      .required("Browser URL is required"),
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
  const [appDropdown, setAppDropdown] = useState([]);
  const [fetchingLink, setFetchingLink] = useState(false);
  const [checkingLink, setCheckingLink] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [fetchingApps, setFetchingApp] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState({});
  const [formEditing, setFormEditing] = useState(false);
  const handleOpen = () => {
    // setOpen(true);
    setOpenForm(true);
  };
  const handleClose = () => {
    // setOpenForm(false);
    // setFormEditing(false);
    // setInitialValues({
    //   project_id: null,
    //   dynamic_link_name: "",
    //   link_param: "",
    //   browser_url: "",
    //   open_in_ios: "",
    //   open_in_android: "",
    //   open_in_app_ios_application_id: null,
    //   open_in_app_android_application_id: null,
    // });
    window.location.reload();
  };
  // Delete Modal
  const handleDeleteConfirmation = () => {
    setOpenDeleteModal(!openDeleteModal);
  };
  async function getLinks(link_id = 0, project_id = 0) {
    try {
      setLoadingData(true);
      const result = await ApiService(
        {
          link_id: link_id,
          project_id: project_id,
        },
        "get-link"
      );

      const newMap = result?.data?.map((table) => {
        return { ...table, isDeleting: false, isEditing: false };
      });

      setTableData(newMap);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoadingData(false);
    }
  }
  const onSubmit = async (values) => {
    console.log(values);
    if (errMessage) {
      // Optionally, you can display a toast or some notification here
      console.log("Form cannot be submitted due to errors:", errMessage);
      toast.error("Invalid Custom Link");
      return; // Prevent form submission
    }
    const { link_param, ...newObj } = values;
    const reqdata = {
      ...newObj,
      project_id: values?.project_id?.value,
      open_in_app_android: values?.open_in_android === "App" ? 1 : 0,
      open_in_browser_android: values?.open_in_android === "Browser" ? 1 : 0,
      open_in_app_android_application_id:
        values?.open_in_app_android_application_id?.value,
      open_in_app_ios: values?.open_in_ios === "App" ? 1 : 0,
      open_in_browser_ios: values?.open_in_ios === "Browser" ? 1 : 0,
      open_in_app_ios_application_id:
        values?.open_in_app_ios_application_id?.value,
      is_deleted: 0,
    };
    console.log(reqdata);
    try {
      setSubmitForm(true);

      const result = await ApiService(reqdata, "link");

      console.log(result);

      if (result?.status === 201) {
        toast.success(
          `Dynamic Link${formEditing ? " Updated Successfully" : " Added"}`
        );
        setOpenForm(false);
        setFormEditing(false);
        setInitialValues({
          project_id: null,
          dynamic_link_name: "",
          link_param: "",
          browser_url: "",
          open_in_ios: "",
          open_in_android: "",
          open_in_app_ios_application_id: null,
          open_in_app_android_application_id: null,
        });
        getLinks(0, 0);
      }

      // return result;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setErrMessage("");
      setSuccessMessage("");
      setSubmitForm(false);
    }
  };
  async function getApplicationDropdown(project) {
    try {
      setFetchingApp(true);
      const result = await ApiService(
        {
          id: userProfile?.user_id,
          name: userProfile?.user_name,
          p_id: project.value ? project.value : project,
        },
        "application/getall-application"
      );
      console.log(result);

      const newMap = result?.data?.map((app) => {
        return {
          label: app?.package_name,
          value: app?.id,
          platform: app?.platform,
        };
      });
      console.log(newMap);
      setAppDropdown(newMap);
      return newMap;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setFetchingApp(false);
    }
  }
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
  async function getAccessLinkUrl(values, setFieldTouched) {
    const reqdata = {
      ...values,
      created_by: userProfile?.user_role_id,
      created_by_name: userProfile?.user_name,
    };
    try {
      setFetchingLink(true);
      const result = await ApiService(reqdata, "link");

      const res = result?.data;
      console.log(res);
      setInitialValues({
        ...res,
        project_id: projectDropdown?.filter(
          (p) => p?.value === res?.project_id
        )[0],
        open_in_ios: "Browser",
        open_in_android: "Browser",
      });
      Object.keys(values).forEach((field) => {
        setFieldTouched(field, true);
      });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setFetchingLink(false);
    }
  }
  const debouncedCheckLink = debounce(
    async (value, setErrMessage, setSuccessMessage) => {
      try {
        setCheckingLink(true);
        const result = await ApiService(
          { custom_dynamic_link: value },
          "validate-link"
        );

        if (result?.data?.result_flag) {
          setErrMessage("Invalid Custom Link");
          setSuccessMessage("");
        } else {
          // Clear error and set success message if Project ID is valid
          setErrMessage("");
          setSuccessMessage("Custom Link is valid");
        }
      } catch (error) {
        toast.error(error?.response?.data?.message);
      } finally {
        setCheckingLink(false);
      }
    },
    500
  ); // 500ms debounce delay
  const deleteDynamicLinks = async () => {
    console.log(deleteItem);
    const reqdata = {
      ...deleteItem,
      is_deleted: 1,
      is_active: 0,
    };
    // Handle form submission
    try {
      setDeleteItem({
        ...deleteItem,
        isDeleting: true,
      });

      const result = await ApiService(reqdata, "link");

      if (result?.status === 201) {
        toast.error("Dynamic Link Deleted");
        handleDeleteConfirmation();
        getLinks(0, 0);
      }

      return result;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setDeleteItem({
        ...deleteItem,
        isDeleting: false,
      });
    }
  };

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
              <HtmlLightTooltip
                title={menu[3]?.edit_flag !== 1 ? "View" : "Edit"}
                placement="top"
                arrow
              >
                <LoadingButton
                  loading={isEditing}
                  disabled={isEditing}
                  className="mui-icon-button"
                  variant="outlined"
                  startIcon={
                    menu[3]?.edit_flag !== 1 ? (
                      <VisibilityOutlinedIcon
                        sx={{ color: isEditing ? "transparent" : "#fff" }}
                      />
                    ) : (
                      <BorderColorOutlinedIcon
                        sx={{ color: isEditing ? "transparent" : "#fff" }}
                      />
                    )
                  }
                  onClick={async () => {
                    console.log(row);

                    try {
                      // Find the index of the matched element in the tableData array
                      setIsEditing(true);

                      const result = await ApiService(
                        { link_id: row?.original?.link_id },
                        "get-link"
                      );

                      const resp = result?.data[0];
                      console.log(resp);

                      const dropdownApp = await getApplicationDropdown(
                        resp?.project_id
                      );
                      console.log(dropdownApp);

                      const app1 = dropdownApp?.find(
                        (app) =>
                          app?.value === resp?.open_in_app_ios_application_id
                      );
                      const app2 = dropdownApp?.find(
                        (app) =>
                          app?.value ===
                          resp?.open_in_app_android_application_id
                      );

                      const newMap = {
                        ...resp,
                        project_id: projectDropdown?.filter(
                          (pr) => pr?.value === resp?.project_id
                        )[0],
                        open_in_ios: resp?.open_in_browser_ios
                          ? "Browser"
                          : "App",
                        open_in_android: resp?.open_in_browser_android
                          ? "Browser"
                          : "App",
                        open_in_app_ios_application_id: app1,
                        open_in_app_android_application_id: app2,
                      };

                      setInitialValues(newMap);
                      setFormEditing(true);
                      setOpenForm(true);
                    } catch (error) {
                      toast.error(error?.response?.data?.message);
                    } finally {
                      setIsEditing(false);
                    }
                  }}
                />
              </HtmlLightTooltip>

              {menu[3]?.delete_flag ? (
                <HtmlLightTooltip title="Delete" placement="top" arrow>
                  <LoadingButton
                    className="mui-icon-button"
                    variant="outlined"
                    startIcon={<DeleteForeverOutlinedIcon />}
                    onClick={() => {
                      console.log(row.original);
                      setDeleteItem(row?.original);
                      handleDeleteConfirmation();
                    }}
                  />
                </HtmlLightTooltip>
              ) : (
                <></>
              )}
            </Stack>
          );
        },
      },
    ],
    [menu, projectDropdown]
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
  useEffect(() => {
    getLinks();
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
              {menu[3]?.add_flag ? (
                !openForm && (
                  <Button variant="contained" onClick={handleOpen}>
                    Add Link
                  </Button>
                )
              ) : (
                <></>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {!openForm ? (
            <>
              <Dialog
                open={openDeleteModal}
                aria-labelledby="responsive-dialog-title"
                PaperProps={{
                  style: {
                    width: "500px",
                  },
                }}
                className="delete-dialog"
              >
                <DialogTitle>
                  <ErrorOutlineIcon />
                </DialogTitle>
                <DialogContent>
                  <DialogContentText color="black">
                    Are you sure you want to delete{" "}
                    {deleteItem?.dynamic_link_name}?
                  </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ display: "flex", gap: "10px" }}>
                  <Button
                    autoFocus
                    onClick={() => {
                      setOpenDeleteModal(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <LoadingButton
                    loading={deleteItem?.isDeleting}
                    disabled={deleteItem?.isDeleting}
                    variant="outlined"
                    onClick={deleteDynamicLinks}
                    autoFocus
                  >
                    Delete
                  </LoadingButton>
                </DialogActions>
              </Dialog>
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
                      placeholder="Select Project"
                      options={projectDropdown}
                      id="project"
                      isClearable
                      onChange={(option) => {
                        setSelectedProject(option);
                        getLinks(0, option?.value);
                      }}
                      value={selectedProject}
                    />
                  </Grid>
                  {/* <Grid item md={3} xs={6}>
                  <CustomSelect
                    placeholder="Select Application"
                    options={appDropdown}
                    isLoading={fetchingApps}
                    id="application"
                    isClearable
                  />
                </Grid> */}
                </Grid>
                <Box
                  sx={{ width: "100%", overflowX: "auto", display: "block" }}
                >
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
                    {loadingData ? (
                      <TableBody>
                        <TableRow>
                          <TableCell
                            colSpan={columns.length + 1}
                            align="center"
                          >
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
                                    {...cell.getCellProps({
                                      style: { minWidth: cell.column.minWidth },
                                    })}
                                    sx={{
                                      border: "1px solid #dbe0e5a6",
                                    }}
                                  >
                                    {cell.column.customCell ? (
                                      <cell.column.customCell
                                        value={cell.value}
                                      />
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
                            <TableCell
                              colSpan={columns.length + 1}
                              align="center"
                            >
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
            </>
          ) : (
            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({
                setFieldTouched,
                setFieldValue,
                setFieldError,
                validateForm,
                handleSubmit,
                values,
              }) => (
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
                            <Field name="project_id">
                              {({ field }) => (
                                <CustomSelect
                                  {...field}
                                  isDisabled={
                                    formEditing
                                      ? menu[3]?.edit_flag !== 1
                                      : menu[3]?.add_flag !== 1
                                  }
                                  placeholder="Select Project"
                                  options={projectDropdown}
                                  id="project_id"
                                  onChange={(option) => {
                                    setFieldValue("project_id", option);
                                    getApplicationDropdown(option);
                                  }}
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="project_id"
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
                                  disabled={
                                    formEditing
                                      ? menu[3]?.edit_flag !== 1
                                      : menu[3]?.add_flag !== 1
                                  }
                                  fullWidth
                                  id="dynamic_link_name"
                                  size="small"
                                  InputLabelProps={{ shrink: true }}
                                  onChange={async (e) => {
                                    const value = e.target.value;
                                    const regex = /^\S+$/;

                                    if (
                                      !value ||
                                      regex.test(value.toString())
                                    ) {
                                      // setFieldValue("link_param", "");
                                      setFieldValue("dynamic_link_name", value);
                                    } else {
                                      return;
                                    }
                                  }}
                                  endAdornment={
                                    <LoadingButton
                                      className="disable-button"
                                      loading={fetchingLink}
                                      disabled={formEditing || fetchingLink}
                                      variant="contained"
                                      fullWidth
                                      sx={{
                                        position: "absolute",
                                        backgroundColor: "primary.main",
                                        width: "25%",
                                        right: 0,
                                        height: "37px",
                                        borderTopLeftRadius: 0,
                                        borderBottomLeftRadius: 0,
                                        boxShadow: "none",
                                      }}
                                      onClick={async () => {
                                        // Mark `project_id` and `dynamic_link_name` as touched
                                        setFieldTouched("project_id", true);
                                        setFieldTouched(
                                          "dynamic_link_name",
                                          true
                                        );

                                        // Validate the entire form, but only focus on `project_id` and `dynamic_link_name`
                                        const validationErrors =
                                          await validateForm();

                                        let hasError = false;

                                        // Check for `project_id` error and display it if found
                                        if (validationErrors.project_id) {
                                          setFieldError(
                                            "project_id",
                                            "Project is required."
                                          );
                                          // toast.error("Project is required.");
                                          hasError = true; // Set flag that there is an error
                                        }

                                        // Check for `dynamic_link_name` error and display it if found
                                        if (
                                          validationErrors.dynamic_link_name
                                        ) {
                                          setFieldError(
                                            "dynamic_link_name",
                                            "Dynamic Link Name is required."
                                          );
                                          // toast.error(
                                          //   "Dynamic Link Name is required."
                                          // );
                                          hasError = true; // Set flag that there is an error
                                        }

                                        // If no errors, proceed with API call
                                        if (!hasError) {
                                          if (formEditing) {
                                            const formValues = {
                                              ...values,
                                              project_id:
                                                values?.project_id?.value,
                                            };
                                            getAccessLinkUrl(
                                              formValues,
                                              setFieldTouched
                                            );
                                          } else {
                                            const formValues = {
                                              ...values,
                                              project_id:
                                                values?.project_id?.value,
                                              dynamic_link_name:
                                                values?.dynamic_link_name,
                                              link_id: 0,
                                            };
                                            getAccessLinkUrl(
                                              formValues,
                                              setFieldTouched
                                            );
                                          }
                                        }
                                      }}
                                    >
                                      Generate Link
                                    </LoadingButton>
                                  }
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

                            <Field name="link_param">
                              {({ field }) => (
                                <BootstrapInput
                                  {...field}
                                  disabled
                                  fullWidth
                                  id="link_param"
                                  size="small"
                                  InputLabelProps={{ shrink: true }}
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="link_param"
                              component="div"
                              className="text-error text-12 mt-5"
                            />
                          </FormControl>
                        </Grid>

                        <Grid item md={6} className="w-full">
                          <FormControl variant="standard" fullWidth>
                            <Typography className="label d-flex items-center">
                              Custom Dynamic Link
                              <sup className="asc">*</sup>
                            </Typography>

                            <Field name="custom_dynamic_link">
                              {({ field }) => (
                                <BootstrapInput
                                  {...field}
                                  disabled={
                                    formEditing
                                      ? menu[3]?.edit_flag !== 1
                                      : menu[3]?.add_flag !== 1
                                  }
                                  fullWidth
                                  id="custom_dynamic_link"
                                  size="small"
                                  InputLabelProps={{ shrink: true }}
                                  endAdornment={
                                    <InputAdornment position="end">
                                      {checkingLink ? (
                                        <CircularProgress
                                          sx={{
                                            color: "#eb6400 !important",
                                          }}
                                        />
                                      ) : (
                                        <></>
                                      )}
                                    </InputAdornment>
                                  }
                                  onChange={async (e) => {
                                    const value = e.target.value;
                                    const regex = /^\S+$/;

                                    if (
                                      !value ||
                                      (regex.test(value.toString()) &&
                                        value.length <= 100)
                                    ) {
                                      // setFieldValue("project_id", value, false);
                                      setFieldValue(
                                        "custom_dynamic_link",
                                        value
                                      );
                                      setSuccessMessage("");
                                      setErrMessage("");

                                      if (value?.length >= 20) {
                                        debouncedCheckLink(
                                          value,
                                          setErrMessage,
                                          setSuccessMessage
                                        );
                                      }
                                    } else {
                                      return;
                                    }
                                  }}
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="custom_dynamic_link"
                              component="div"
                              className="text-error text-12 mt-5"
                            />
                            {errMessage && (
                              <div className="text-error text-12 mt-5">
                                {errMessage}
                              </div>
                            )}
                            {successMessage && (
                              <div className="text-success text-12 mt-5">
                                {successMessage}
                              </div>
                            )}
                          </FormControl>
                        </Grid>

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
                                  disabled={
                                    !values.link_param || formEditing
                                      ? menu[3]?.edit_flag !== 1
                                      : menu[3]?.add_flag !== 1
                                  }
                                  InputLabelProps={{ shrink: true }}
                                  onChange={async (e) => {
                                    const value = e.target.value;
                                    const regex = /^\S+$/;

                                    if (
                                      !value ||
                                      regex.test(value.toString())
                                    ) {
                                      setFieldValue("browser_url", value);
                                    } else {
                                      return;
                                    }
                                  }}
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
                              onChange={(e) => {
                                setFieldValue("open_in_ios", e.target.value);

                                // Clear the dropdown if 'Browser' is selected
                                if (e.target.value === "Browser") {
                                  setFieldValue(
                                    "open_in_app_ios_application_id",
                                    null
                                  );
                                }
                              }}
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
                                disabled={
                                  !values.link_param
                                  // || formEditing
                                  // ? menu[3]?.edit_flag !== 1
                                  // : menu[3]?.add_flag !== 1
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
                                sx={{ width: "55%" }}
                                disabled={
                                  !values.link_param
                                  // || formEditing
                                  // ? menu[3]?.edit_flag !== 1
                                  // : menu[3]?.add_flag !== 1
                                }
                              />
                              <ErrorMessage
                                name="open_in_ios"
                                component="div"
                                className="text-error text-12 mt-5"
                              />
                            </Field>

                            <Field
                              disabled={
                                values.open_in_ios !== "App" ||
                                !values.link_param
                              }
                              name="open_in_app_ios_application_id"
                            >
                              {({ field }) => (
                                <CustomSelect
                                  {...field}
                                  isDisabled={
                                    values.open_in_ios !== "App" ||
                                    !values.link_param
                                  }
                                  placeholder="Select Application"
                                  options={appDropdown?.filter(
                                    (item) => item.platform === "ios"
                                  )}
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
                              onChange={(e) => {
                                setFieldValue(
                                  "open_in_android",
                                  e.target.value
                                );

                                // Clear the dropdown if 'Browser' is selected
                                if (e.target.value === "Browser") {
                                  setFieldValue(
                                    "open_in_app_android_application_id",
                                    null
                                  );
                                }
                              }}
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
                                disabled={
                                  !values.link_param
                                  // || formEditing
                                  // ? menu[3]?.edit_flag !== 1
                                  // : menu[3]?.add_flag !== 1
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
                                sx={{ width: "55%" }}
                                disabled={
                                  !values.link_param
                                  // || formEditing
                                  // ? menu[3]?.edit_flag !== 1
                                  // : menu[3]?.add_flag !== 1
                                }
                              />
                              <ErrorMessage
                                name="open_in_android"
                                component="div"
                                className="text-error text-12 mt-5"
                              />
                            </Field>

                            <Field
                              disabled={
                                values.open_in_android !== "App" ||
                                !values.link_param
                              }
                              name="open_in_app_android_application_id"
                            >
                              {({ field }) => (
                                <CustomSelect
                                  {...field}
                                  isDisabled={
                                    values.open_in_android !== "App" ||
                                    !values.link_param
                                  }
                                  placeholder="Select Application"
                                  options={appDropdown?.filter(
                                    (item) => item.platform === "android"
                                  )}
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
                        {formEditing ? (
                          <>
                            <Grid
                              item
                              md={menu[3]?.edit_flag ? 10 : 11}
                              xs={2}
                            ></Grid>
                            {menu[3]?.edit_flag !== 1 ? (
                              <Grid item md={1} xs={5}>
                                <Button
                                  fullWidth
                                  variant="outlined"
                                  sx={{ backgroundColor: "primary.main" }}
                                  onClick={handleClose}
                                >
                                  Back
                                </Button>
                              </Grid>
                            ) : (
                              <></>
                            )}
                            {menu[3]?.edit_flag ? (
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
                            ) : (
                              <></>
                            )}
                            {menu[3]?.edit_flag ? (
                              <Grid item md={1} xs={5}>
                                <LoadingButton
                                  // className="disable-button"
                                  loading={submitForm}
                                  disabled={submitForm || errMessage}
                                  type="submit"
                                  fullWidth
                                  variant="contained"
                                  sx={{ backgroundColor: "primary.main" }}
                                >
                                  Save
                                </LoadingButton>
                              </Grid>
                            ) : (
                              <></>
                            )}
                          </>
                        ) : (
                          <>
                            <Grid
                              item
                              md={menu[3]?.add_flag ? 10 : 11}
                              xs={2}
                            ></Grid>
                            {menu[3]?.add_flag !== 1 ? (
                              <Grid item md={1} xs={5}>
                                <Button
                                  fullWidth
                                  variant="outlined"
                                  sx={{ backgroundColor: "primary.main" }}
                                  onClick={handleClose}
                                >
                                  Back
                                </Button>
                              </Grid>
                            ) : (
                              <></>
                            )}
                            {menu[3]?.add_flag ? (
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
                            ) : (
                              <></>
                            )}
                            {menu[3]?.add_flag ? (
                              <Grid item md={1} xs={5}>
                                <LoadingButton
                                  // className="disable-button"
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
                            ) : (
                              <></>
                            )}
                          </>
                        )}
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
                            <Field name="link_param">
                              {({ field }) => (
                                <BootstrapInput
                                  {...field}
                                  fullWidth
                                  id="link_param"
                                  size="small"
                                  placeholder="/zyx"
                                  InputLabelProps={{ shrink: true }}
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="link_param"
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
