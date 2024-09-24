/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from "react";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
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
  Tooltip,
  Typography,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

// third-party
import * as Yup from "yup";
import { useTable, usePagination, useGlobalFilter } from "react-table";

// project-imports
import {
  TablePagination,
  HeaderSort,
  GlobalFilter,
  HidingSelect,
  StyledTableCell,
} from "../../utils/ReactTable/index";
import { BootstrapInput } from "../../utils/Input/textfield";
import { useSortBy } from "react-table";
import { tableColumns, VisibleColumn } from "../../data/Project";
import { CustomSelect } from "../../utils/Input/reactSelect";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { toast } from "react-toastify";
import { ApiService } from "../../utils/api/apiCall";
import { useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import { HtmlLightTooltip } from "../../utils/components/Tooltip";
import { useLocation, useNavigate } from "react-router-dom";
import { debounce } from "lodash";

function Project() {
  const { userProfile } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const { project_data } = location.state || {}; // Access 'id' from the state
  console.log(project_data);
  const [openForm, setOpenForm] = useState(false);
  const [checkUniqueID, setCheckUniqueID] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [submitForm, setSubmitForm] = useState(false);
  const [initialValues, setInitialValues] = useState({
    project_name: "",
    project_id: "",
    project_owner: null, // Assuming user is selected from CustomSelect
    project_description: "",
  });
  const [tableData, setTableData] = useState([]);
  const [ownerDropdown, setOwnerDropdown] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState({});
  const [formEditing, setFormEditing] = useState(false);
  const [loadingProjectData, setLoadingProjectData] = useState(false);

  // Delete Modal
  const handleDeleteConfirmation = () => {
    setOpenDeleteModal(!openDeleteModal);
  };
  // Validation
  const validationSchema = Yup.object().shape({
    project_name: Yup.string().required("Project Name is required"),
    project_id: Yup.string()
      .min(15, "Minimum length should be 15")
      .required("Project ID is required"),
    project_description: Yup.string().required(
      "Project Description is required"
    ),
    project_owner: Yup.object().required("Owner is required"),
  });
  // CRUD
  async function getProjects() {
    try {
      setLoadingData(true);
      const result = await ApiService({}, "project/getall-project");

      console.log(result);
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

  async function getOwnerDropdown() {
    try {
      const result = await ApiService({ method: "getusers" }, "masters/get");

      console.log(result);
      const newMap = result?.data?.map((user) => {
        return { label: user?.name, value: user?.user_id };
      });

      setOwnerDropdown(newMap);
      return newMap;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
  const debouncedCheckProjectUnique = debounce(
    async (value, setErrors, setFieldError, setSuccessMessage) => {
      try {
        setCheckUniqueID(true);
        const result = await ApiService(
          { project_id: value },
          "project/validate-id"
        );

        if (result?.data?.result_flag) {
          // Set error if Project ID is invalid
          setErrMessage("Invalid Project ID");
          setFieldError("project_id", "");
          // setFieldError("project_id", "Invalid Project ID");
          // setErrors({ project_id: "Invalid Project ID" });
          setSuccessMessage("");
        } else {
          // Clear error and set success message if Project ID is valid
          setErrMessage("");
          setSuccessMessage("Project ID is valid");
          setFieldError("project_id", ""); // Clear previous error
        }
      } catch (error) {
        toast.error(error?.response?.data?.message);
      } finally {
        setCheckUniqueID(false);
      }
    },
    500
  ); // 500ms debounce delay
  const checkProjectUnique = debounce(async (value) => {
    try {
      setCheckUniqueID(true);

      const result = await ApiService(
        { project_id: value },
        "project/validate-id"
      );

      console.log(result);
      return result;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setCheckUniqueID(false);
    }
  }, 500); // 500ms debounce delay
  const onSubmit = async (values) => {
    console.log(values);
    if (errMessage) {
      // Optionally, you can display a toast or some notification here
      console.log("Form cannot be submitted due to errors:", errMessage);
      setSubmitForm(false); // Stop the form submission
      return; // Prevent form submission
    }
    const reqdata = {
      ...values,
      project_owner: values?.project_owner?.value,
      created_by: userProfile?.user_id,
      created_by_name: userProfile?.user_name,
    };
    // Handle form submission
    try {
      setSubmitForm(true);

      const result = await ApiService(reqdata, "project/create");

      console.log(result);

      if (result?.status === 201) {
        toast.success(
          `Project${formEditing ? " Updated Successfully" : " Added"}`
        );
        setOpenForm(false);
        setFormEditing(false);
        setInitialValues({
          project_name: "",
          project_id: "",
          project_owner: null,
          project_description: "",
        });
        getProjects();
      }

      // return result;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setSubmitForm(false);
    }
  };
  const deleteProject = async () => {
    console.log(deleteItem);
    const reqdata = {
      ...deleteItem,
      is_deleted: 1,
      is_active: 0,
    };
    console.log(reqdata);
    // Handle form submission
    try {
      // Set the updated tableData state
      setDeleteItem({
        ...deleteItem,
        isDeleting: true,
      });

      const result = await ApiService(reqdata, "project/create");

      if (result?.status === 201) {
        toast.error("Project Deleted");
        handleDeleteConfirmation();
        getProjects();
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
  // Form
  const handleOpen = () => {
    setSuccessMessage("");
    setOpenForm(true);
  };
  const handleClose = () => {
    // setSuccessMessage("");
    // setOpenForm(false);
    // setFormEditing(false);
    // setInitialValues({
    //   project_name: "",
    //   project_id: "",
    //   project_owner: null,
    //   project_description: "",
    // });
    window.location.reload();
  };
  // Table
  const dataColumns = useMemo(
    () => [
      ...tableColumns,
      {
        Header: "Actions",
        accessor: "id",
        right: true,
        Cell: ({ value, row }) => {
          const [isEditing, setIsEditing] = useState(false);

          return (
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              {/* <Tooltip title="View" placement="top" arrow>
                <Button
                  className="mui-icon-button"
                  variant="outlined"
                  startIcon={<VisibilityOutlined />}
                />
              </Tooltip> */}
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
                    console.log(tableData);
                    try {
                      // Find the index of the matched element in the tableData array
                      setIsEditing(true);

                      const result = await ApiService(
                        { id: row?.original?.id },
                        "project/getone-project"
                      );

                      const resp = result?.data[0];

                      const newMap = {
                        ...resp,
                        project_owner: ownerDropdown?.filter(
                          (user) => user?.value === resp?.project_owner
                        )[0],
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

              <HtmlLightTooltip title="Delete" placement="top" arrow>
                <LoadingButton
                  className="mui-icon-button"
                  variant="outlined"
                  startIcon={<DeleteForeverOutlinedIcon />}
                  onClick={() => {
                    setDeleteItem(row?.original);
                    handleDeleteConfirmation();
                  }}
                />
              </HtmlLightTooltip>
            </Stack>
          );
        },
      },
    ],
    [ownerDropdown, tableData]
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

  // useEffect(() => {
  //   getOwnerDropdown();
  // }, []);
  // useEffect(() => {
  //   getProjects();
  // }, []);
  // useEffect(() => {
  // async function getOneProject(project) {
  //   try {
  //     // Find the index of the matched element in the tableData array
  //     setLoadingProjectData(true);

  //     const result = await ApiService(
  //       { id: project?.id },
  //       "project/getone-project"
  //     );

  //     const resp = result?.data[0];

  //     const newMap = {
  //       ...resp,
  //       project_owner: ownerDropdown?.filter(
  //         (user) => user?.value === resp?.project_owner
  //       )[0],
  //     };

  //     setInitialValues(newMap);
  //     setFormEditing(true);
  //     setOpenForm(true);
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message);
  //   } finally {
  //     setLoadingProjectData(false);
  //   }
  // }
  //   if (project_data) {
  //     console.log("project box click");
  //     getOneProject(project_data);
  //   }
  // }, [ownerDropdown, project_data]);
  useEffect(() => {
    async function getOneProject(project, ownerDropdown) {
      try {
        // Find the index of the matched element in the tableData array
        setLoadingProjectData(true);

        const result = await ApiService(
          { id: project?.id },
          "project/getone-project"
        );

        const resp = result?.data[0];

        const newMap = {
          ...resp,
          project_owner: ownerDropdown?.filter(
            (user) => user?.value === resp?.project_owner
          )[0],
        };

        setInitialValues(newMap);
        setFormEditing(true);
        setOpenForm(true);
      } catch (error) {
        toast.error(error?.response?.data?.message);
      } finally {
        setLoadingProjectData(false);
      }
    }
    async function fetchData() {
      try {
        // Get the owner dropdown and project list first
        const ownerDropdown = await getOwnerDropdown();
        await getProjects();

        // After both async functions have completed, check for project data
        if (project_data) {
          console.log("project box click");
          await getOneProject(project_data, ownerDropdown); // Call getOneProject after both are done
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [project_data]); // Use project_data as dependency
  // useEffect(() => {
  //   // Clear the state after initial render (like after refresh)
  //   if (project_data) {
  //     navigate(location.pathname, { replace: true, state: {} });
  //   }
  // }, [project_data, navigate, location.pathname]);
  useEffect(() => {
    const handleUnload = () => {
      // Clear the state before the page unloads or refreshes
      navigate(location.pathname, { replace: true, state: {} });
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [navigate, location.pathname]);

  return (
    <>
      <Grid container spacing={4} sx={{ width: "100%" }}>
        <Grid item xs={12}>
          <Grid container display="flex" alignItems="center">
            <Grid item xs={6}>
              <Typography variant="h5" fontWeight={500}>
                Projects
              </Typography>
              <Typography variant="caption" sx={{ color: "text.grey", mt: 2 }}>
                Manage Projects
              </Typography>
            </Grid>
            <Grid item xs={6} display="flex" justifyContent="flex-end">
              {!openForm && (
                <Button variant="contained" onClick={handleOpen}>
                  Add Project
                </Button>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {!openForm ? (
            <>
              {loadingProjectData ? (
                <Backdrop
                  sx={(theme) => ({
                    backgroundColor: "rgba(0,0,0,0.15)",
                    color: "#fff",
                    zIndex: 1,
                  })}
                  open={true}
                >
                  <Stack gap={2} alignItems="center">
                    <CircularProgress
                      className="table_loader"
                      color="inherit"
                    />
                    <Typography>Loading project...</Typography>
                  </Stack>
                </Backdrop>
              ) : (
                <></>
              )}
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
                    Are you sure you want to delete {deleteItem?.project_name}?
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
                    onClick={deleteProject}
                    autoFocus
                  >
                    Delete
                  </LoadingButton>
                </DialogActions>
              </Dialog>
              <TableContainer component={Paper}>
                <Grid container spacing={2} px={2} py={2}>
                  <Grid item md={3} xs={6}>
                    <GlobalFilter
                      globalFilter={globalFilter}
                      setGlobalFilter={setGlobalFilter}
                    />
                  </Grid>
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
                setFieldValue,
                setFieldTouched,
                setFieldError,
                handleSubmit,
                setErrors,
                setTouched,
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
                        {/* Project Name Field */}
                        <Grid item md={4} sx={{ width: "100%" }}>
                          <FormControl variant="standard" fullWidth>
                            <Typography className="label d-flex items-center">
                              Project name
                              <sup className="asc">*</sup>
                            </Typography>
                            <Field name="project_name">
                              {({ field }) => (
                                <BootstrapInput
                                  {...field}
                                  fullWidth
                                  id="project_name"
                                  size="small"
                                  placeholder="Project Name"
                                  InputLabelProps={{ shrink: true }}
                                  onChange={(e) => {
                                    e.preventDefault();
                                    const { value } = e.target;

                                    const regex = /^[a-zA-Z][a-zA-Z\s]*$/;

                                    if (
                                      !value ||
                                      (regex.test(value.toString()) &&
                                        value.length <= 50)
                                    ) {
                                      setFieldValue("project_name", value);
                                    } else {
                                      return;
                                    }
                                  }}
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="project_name"
                              component="div"
                              className="text-error text-12 mt-5"
                            />
                          </FormControl>
                        </Grid>

                        {/* Project ID Field */}
                        <Grid item md={4} sx={{ width: "100%" }}>
                          <FormControl variant="standard" fullWidth>
                            <Typography className="label d-flex items-center">
                              Project ID
                              <sup className="asc">*</sup>
                            </Typography>
                            <Field name="project_id">
                              {({ field }) => (
                                <BootstrapInput
                                  {...field}
                                  fullWidth
                                  id="project_id"
                                  size="small"
                                  placeholder="Project ID"
                                  InputLabelProps={{ shrink: true }}
                                  onChange={async (e) => {
                                    const value = e.target.value;
                                    const regex = /^\S+$/;

                                    if (
                                      !value ||
                                      (regex.test(value.toString()) &&
                                        value.length <= 50)
                                    ) {
                                      // setFieldValue("project_id", value, false);
                                      setFieldValue("project_id", value);
                                      setSuccessMessage("");
                                      setErrMessage("");

                                      if (value?.length > 15) {
                                        debouncedCheckProjectUnique(
                                          value,
                                          setErrors,
                                          setFieldError,
                                          setSuccessMessage
                                        );
                                        // Use the debounced version of checkProjectUnique
                                        // const response =
                                        //   await checkProjectUnique(value);
                                        // if (response?.data?.result_flag) {
                                        //   setFieldError(
                                        //     "project_id",
                                        //     "Invalid Project ID"
                                        //   );
                                        //   setSuccessMessage("");
                                        // } else {
                                        //   setSuccessMessage(
                                        //     "Project ID is valid"
                                        //   );
                                        //   setFieldError("project_id", ""); // Clear previous error
                                        // }
                                      }
                                    } else {
                                      return;
                                    }
                                    // setFieldTouched("project_id", true, false);
                                    setFieldTouched("project_id", true);
                                  }}
                                  // onBlur={() => {
                                  //   setFieldTouched("project_id", true, false);
                                  //   if (errMessage) {
                                  //     // setFieldError(
                                  //     //   "project_id",
                                  //     //   "Invalid Project ID"
                                  //     // );
                                  //   }
                                  // }}
                                  endAdornment={
                                    <InputAdornment position="end">
                                      {checkUniqueID ? (
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
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="project_id"
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

                        {/* Owner Select Field */}
                        <Grid item md={4} sx={{ width: "100%" }}>
                          <FormControl variant="standard" fullWidth>
                            <Typography className="label d-flex items-center">
                              Owner
                              <sup className="asc">*</sup>
                            </Typography>
                            <Field name="project_owner">
                              {({ field }) => (
                                <CustomSelect
                                  {...field}
                                  options={ownerDropdown}
                                  placeholder="Select Owner"
                                  id="project_owner"
                                  onChange={(selectedOption) =>
                                    setFieldValue(
                                      "project_owner",
                                      selectedOption
                                    )
                                  }
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="project_owner"
                              component="div"
                              className="text-error text-12 mt-5"
                            />
                          </FormControl>
                        </Grid>

                        {/* Project Description Field */}
                        <Grid item md={8} sx={{ width: "100%" }}>
                          <FormControl variant="standard" fullWidth>
                            <Typography className="label d-flex items-center">
                              Description
                              <sup className="asc">*</sup>
                            </Typography>
                            <Field name="project_description">
                              {({ field }) => (
                                <BootstrapInput
                                  {...field}
                                  fullWidth
                                  id="project_description"
                                  size="small"
                                  placeholder="Project Description"
                                  InputLabelProps={{ shrink: true }}
                                  onChange={(e) => {
                                    e.preventDefault();
                                    const { value } = e.target;

                                    // const regex = /^[a-zA-Z][a-zA-Z\s]*$/;

                                    if (
                                      !value ||
                                      value.length <= 200
                                      // (regex.test(value.toString()) &&
                                    ) {
                                      setFieldValue(
                                        "project_description",
                                        value?.trimStart()
                                      );
                                    } else {
                                      return;
                                    }
                                  }}
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="project_description"
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

export default Project;

// async function getOneProject(project) {
//   try {
//     // Find the index of the matched element in the tableData array
//     setLoadingProjectData(true);

//     const result = await ApiService(
//       { id: project?.id },
//       "project/getone-project"
//     );

//     const resp = result?.data[0];

//     const newMap = {
//       ...resp,
//       project_owner: ownerDropdown?.filter(
//         (user) => user?.value === resp?.project_owner
//       )[0],
//     };

//     setInitialValues(newMap);
//     setFormEditing(true);
//     setOpenForm(true);
//   } catch (error) {
//     toast.error(error?.response?.data?.message);
//   } finally {
//     setLoadingProjectData(false);
//   }
// }
// if (value?.length > 15) {
//   try {
//     setFieldTouched(
//       "project_id",
//       true
//       // true
//     );
//     const response =
//       await checkProjectUnique(value);
//     if (response?.data?.result_flag) {
//       console.log("error");
//       setFieldError(
//         "project_id",
//         "Invalid Project ID"
//       );
//       // setTouched(
//       //   { project_id: true },
//       //   true
//       // );
//       // setErrors({
//       //   project_id: "Invalid Project ID",
//       // });
//       setSuccessMessage("");
//     } else {
//       setSuccessMessage(
//         "Project ID is valid"
//       );
//       setFieldError("project_id", ""); // Clear previous error
//     }
//   } catch (error) {
//     console.error(
//       "Error checking project ID:",
//       error
//     );
//   }
// }
// const modalStyle = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 400,
//   bgcolor: "background.paper",
//   border: "1px solid #000",
//   boxShadow: 24,
//   pt: 2,
//   px: 4,
//   pb: 3,
// };
/* <Grid
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
              </Grid> */
//   <Modal
//   open={open}
//   onClose={handleClose}
//   aria-labelledby="child-modal-title"
//   aria-describedby="child-modal-description"
//   closeAfterTransition
//   slots={{ backdrop: Backdrop }}
//   slotProps={{
//     backdrop: {
//       timeout: 300,
//     },
//   }}
// >
//   <Box
//     sx={{
//       ...modalStyle,
//       width: {
//         xs: "90%", // 90% of the viewport width for extra-small screens
//         sm: "70%", // 70% of the viewport width for small screens
//         md: "60%", // 60% of the viewport width for medium screens
//         lg: "50%", // 50% of the viewport width for large screens
//         xl: "40%", // 40% of the viewport width for extra-large screens
//       },
//       maxWidth: "600px", // Maximum width constraint
//       margin: "0 auto", // Center the modal horizontally
//     }}
//   >
//     <Grid container sx={{ width: "100%" }}>
//       <Grid item xs={12} sx={{ width: "100%" }}>
//         <Grid
//           container
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             width: "100%",
//           }}
//         >
//           <Grid item sx={{ width: "100%" }}>
//             <Stack
//               direction="row"
//               justifyContent="space-between"
//               alignItems="center"
//             >
//               <Typography
//                 variant="h5"
//                 sx={{ color: "primary.main", fontWeight: 500 }}
//               >
//                 Create a project
//               </Typography>
//               <IconButton
//                 onClick={() => {
//                   // window.location.reload();
//                   handleClose();
//                 }}
//               >
//                 <ClearOutlinedIcon />
//               </IconButton>
//             </Stack>
//           </Grid>
//           <Grid item xs={12} sx={{ width: "100%" }}>
//             <Grid container spacing={3} mt={1}>
//               <Grid
//                 item
//                 xs={12}
//                 component="form"
//                 onSubmit={() => {}}
//                 noValidate
//                 sx={{ width: "100%" }}
//               >
//                 <FormControl variant="standard" fullWidth>
//                   <Typography className="label d-flex items-center">
//                     Enter project name
//                     <sup className="asc">*</sup>
//                   </Typography>
//                   <BootstrapInput
//                     fullWidth
//                     id="name"
//                     size="small"
//                     label="Project Name"
//                     name="name"
//                     placeholder="Project Name"
//                     InputLabelProps={{
//                       shrink: true,
//                     }}
//                   />
//                 </FormControl>
//               </Grid>

//               <Grid item xs={12}>
//                 <FormControl variant="standard" fullWidth>
//                   <Typography className="label d-flex items-center">
//                     Project ID
//                     <sup className="asc">*</sup>
//                   </Typography>
//                   <BootstrapInput
//                     fullWidth
//                     id="project-id"
//                     size="small"
//                     //   label="Project Name"
//                     name="project-id"
//                     placeholder="my-unique-project-id"
//                     InputLabelProps={{
//                       shrink: true,
//                     }}
//                   />
//                 </FormControl>
//               </Grid>

//               <Grid item xs={6}></Grid>
//               <Grid item xs={6}>
//                 <Button
//                   type="submit"
//                   fullWidth
//                   variant="contained"
//                   sx={{ mt: 1, mb: 1, backgroundColor: "primary.main" }}
//                 >
//                   Add
//                 </Button>
//               </Grid>
//             </Grid>
//           </Grid>
//         </Grid>
//       </Grid>
//     </Grid>
//   </Box>
// </Modal>
