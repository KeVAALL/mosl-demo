/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from "react";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
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
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { CustomSelect } from "../../utils/Input/reactSelect";
// third-party
import { useTable, usePagination, useGlobalFilter } from "react-table";
import * as Yup from "yup";
// project-imports
import {
  TablePagination,
  HeaderSort,
  GlobalFilter,
  HidingSelect,
  StyledTableCell,
} from "../../utils/ReactTable/index";
import { useSortBy } from "react-table";
import { tableColumns, VisibleColumn } from "../../data/Application";
// import AndroidStepper from "../../section/Application/AndroidStepper";
// import AndroidModal from "../../section/Application/AndroidModal";
// import IOSModal from "../../section/Application/IOSModal";
// import WebAppModal from "../../section/Application/WebAppModal";
import { BootstrapInput } from "../../utils/Input/textfield";
import { ApiService } from "../../utils/api/apiCall";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { HtmlLightTooltip } from "../../utils/components/Tooltip";

function Application() {
  const { userProfile } = useSelector((state) => state.user);
  const { menu } = useSelector((state) => state.menu);
  const { SELECTED_PROJECT } = useSelector((state) => state.project);
  const [openForm, setOpenForm] = useState(false);
  const [submitForm, setSubmitForm] = useState(false);
  const [initialValues, setInitialValues] = useState({
    // p_id: null,
    platform: {
      label: "Android",
      value: "android",
    },
    package_name: "",
    app_id: "",
    description: "",
    // bundle_id: "",
    store_url: "",
    // dynamic_url: "",
  });
  const validationSchema = Yup.object().shape({
    // p_id: Yup.object().required("Project is required"),
    platform: Yup.object().required("Platform is required"),
    package_name: Yup.string().required("Package Name is required"),
    app_id: Yup.string().when("platform", (platform, schema) => {
      console.log(platform);
      if (platform[0]?.value === "ios") {
        return schema.required("App ID is required for iOS platform");
      }
      return schema.notRequired();
    }),
    description: Yup.string().required("Description is required"),
    store_url: Yup.string()
      .required("Store URL is required")
      .matches(
        // /^(https:\/\/play\.google\.com\/store\/apps\/details\?id=[a-zA-Z0-9._-]+|https:\/\/apps\.apple\.com\/[a-z]{2}\/app\/[a-zA-Z0-9-]+\/id[0-9]+)$/,
        /^(https:\/\/play\.google\.com\/store\/apps\/details\?id=[a-zA-Z0-9._-]+(&.*)?|https:\/\/apps\.apple\.com\/[a-z]{2}\/app\/[a-zA-Z0-9-]+\/id[0-9]+)$/,
        "Store URL must be a valid Google Play Store or Apple App Store link"
      ),
  });
  const [loadingData, setLoadingData] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [projectDropdown, setProjectDropdown] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState({});
  const [formEditing, setFormEditing] = useState(false);
  const handleOpen = () => {
    setOpenForm(true);
  };
  const handleClose = () => {
    // setOpenForm(false);
    // setFormEditing(false);
    // setInitialValues({
    //   p_id: null,
    //   platform: {
    //     label: "Android",
    //     value: "android",
    //   },
    //   package_name: "",
    //   description: "",
    //   bundle_id: "",
    //   store_url: "",
    //   // dynamic_url: "",
    // });
    window.location.reload();
  };
  const applicationArr = [
    {
      label: "Android",
      value: "android",
    },
    {
      label: "IOS",
      value: "ios",
    },
    {
      label: "Web App",
      value: "webapp",
    },
  ];
  // Delete Modal
  const handleDeleteConfirmation = () => {
    setOpenDeleteModal(!openDeleteModal);
  };
  async function getAllApplication() {
    try {
      setLoadingData(true);
      const result = await ApiService(
        {
          id: userProfile?.user_id,
          name: userProfile?.user_name,
          p_id: 0,
        },
        "application/getall-application"
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
  async function getApplication(project) {
    try {
      setLoadingData(true);
      const result = await ApiService(
        {
          id: userProfile?.user_id,
          name: userProfile?.user_name,
          p_id: project.id,
        },
        "application/getall-application"
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
  const onSubmit = async (values) => {
    console.log(values);
    const reqdata = {
      ...values,
      platform: values?.platform?.value,
      p_id: SELECTED_PROJECT?.id,
      created_by: userProfile?.user_id,
      created_by_name: userProfile?.user_name,
    };
    // Handle form submission
    try {
      setSubmitForm(true);

      const result = await ApiService(reqdata, "application/create");

      console.log(result);

      if (result?.status === 201) {
        toast.success(
          `Application${formEditing ? " Updated Successfully" : " Added"}`
        );
        setOpenForm(false);
        setFormEditing(false);
        setInitialValues({
          // p_id: null,
          platform: {
            label: "Android",
            value: "android",
          },
          package_name: "",
          description: "",
          bundle_id: "",
          store_url: "",
          // dynamic_url: "",
        });
        // setSelectedProject(values?.p_id);
        getApplication(SELECTED_PROJECT);
      }

      // return result;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setSubmitForm(false);
    }
  };
  const deleteApplication = async () => {
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

      const result = await ApiService(reqdata, "application/create");

      if (result?.status === 201) {
        toast.error("Application Deleted");
        handleDeleteConfirmation();
        getApplication(SELECTED_PROJECT);
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
                title={menu[2]?.edit_flag !== 1 ? "View" : "Edit"}
                placement="top"
                arrow
              >
                <LoadingButton
                  loading={isEditing}
                  disabled={isEditing}
                  className="mui-icon-button"
                  variant="outlined"
                  startIcon={
                    menu[2]?.edit_flag !== 1 ? (
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
                        { id: row?.original?.id },
                        "application/getone-application"
                      );

                      const resp = result?.data[0];

                      const newMap = {
                        ...resp,
                        // p_id: projectDropdown?.filter(
                        //   (project) => project?.value === resp?.p_id
                        // )[0],
                        platform: applicationArr?.filter(
                          (app) => app?.value === resp?.platform?.toLowerCase()
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

              {menu[2]?.delete_flag ? (
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
              ) : (
                <></>
              )}
            </Stack>
          );
        },
      },
    ],
    [tableData, menu]
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
  //   getProjectDropdown();
  // }, []);
  useEffect(() => {
    // getAllApplication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (!SELECTED_PROJECT) {
      getAllApplication();
    } else {
      getApplication(SELECTED_PROJECT);
    }
  }, [SELECTED_PROJECT]);

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
              {menu[2]?.add_flag ? (
                !openForm && (
                  <Button variant="contained" onClick={handleOpen}>
                    Add Application
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
                    Are you sure you want to delete {deleteItem?.package_name}?
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
                    onClick={deleteApplication}
                    autoFocus
                  >
                    Delete
                  </LoadingButton>
                </DialogActions>
              </Dialog>
              <TableContainer component={Paper}>
                <Grid container spacing={1} px={2} py={2}>
                  <Grid item md={2} xs={6}>
                    <GlobalFilter
                      globalFilter={globalFilter}
                      setGlobalFilter={setGlobalFilter}
                    />
                  </Grid>
                  <Grid item md={3} xs={6}>
                    {/* <CustomSelect
                      placeholder="Select Project"
                      options={projectDropdown}
                      value={selectedProject}
                      onChange={(e) => {
                        console.log(e);
                        if (!e) {
                          getAllApplication();
                        } else {
                          getApplication(e);
                        }
                        setSelectedProject(e);
                      }}
                      id="project"
                      isClearable
                    /> */}
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
              {({ setFieldValue, handleSubmit, values }) => (
                <Form onSubmit={handleSubmit}>
                  <Paper elevation={3}>
                    <Box>
                      <Grid
                        container
                        spacing={2.5}
                        mt={1}
                        className="pl-20 pr-20"
                      >
                        <Grid item md={4} sx={{ pb: 2.5 }} className="w-full">
                          <FormControl variant="standard" fullWidth>
                            <Typography className="label d-flex items-center">
                              Platform
                              <sup className="asc">*</sup>
                            </Typography>
                            <Field name="platform">
                              {({ field }) => (
                                <CustomSelect
                                  {...field}
                                  isDisabled={
                                    formEditing
                                      ? menu[2]?.edit_flag !== 1
                                      : menu[2]?.add_flag !== 1
                                  }
                                  options={applicationArr}
                                  placeholder="Select Application"
                                  onChange={(option) => {
                                    console.log(option);
                                    setFieldValue("platform", option);
                                  }}
                                  id="application"
                                  isSearchable={false}
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="platform"
                              component="div"
                              className="text-error text-12 mt-5"
                            />
                          </FormControl>
                        </Grid>
                        {/* <Grid item md={4} sx={{ pb: 2.5 }} className="w-full">
                          <FormControl variant="standard" fullWidth>
                            <Typography className="label d-flex items-center">
                              Project
                              <sup className="asc">*</sup>
                            </Typography>
                            <Field name="p_id">
                              {({ field }) => (
                                <CustomSelect
                                  {...field}
                                  isDisabled={
                                    formEditing
                                      ? menu[2]?.edit_flag !== 1
                                      : menu[2]?.add_flag !== 1
                                  }
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
                        </Grid> */}
                        <Grid item md={12} className="w-full">
                          <Divider textAlign="left">
                            {values?.platform?.value.toUpperCase()}
                          </Divider>
                        </Grid>
                        {/* {selectedApp?.value === "Android" && ( */}
                        <Grid item md={12} className="w-full">
                          <Box
                            sx={
                              {
                                // borderBottom: "1px solid #9e9e9e"
                              }
                            }
                          >
                            <Grid container sx={{ pt: 2.5, pb: 5 }}>
                              <Grid item md={4} className="pr-24 w-full">
                                <FormControl variant="standard" fullWidth>
                                  <Typography className="label d-flex items-center">
                                    {values.platform.value === "android" ? (
                                      <Stack
                                        direction="row"
                                        alignItems="center"
                                      >
                                        <span>Package Name</span>
                                        <HtmlLightTooltip
                                          // open={true}
                                          maxWidth="460px"
                                          arrow
                                          title="intent://send/#Intent;package=com.whatsapp;scheme=whatsapp;end"
                                          placement="right"
                                        >
                                          <InfoOutlinedIcon
                                            style={{
                                              fontSize: "14px",
                                              marginLeft: "4px",
                                            }}
                                          />
                                        </HtmlLightTooltip>
                                      </Stack>
                                    ) : (
                                      "App Name"
                                    )}
                                    <sup className="asc">*</sup>
                                  </Typography>
                                  <Field name="package_name">
                                    {({ field }) => (
                                      <BootstrapInput
                                        {...field}
                                        disabled={
                                          formEditing
                                            ? menu[2]?.edit_flag !== 1
                                            : menu[2]?.add_flag !== 1
                                        }
                                        fullWidth
                                        id="package_name"
                                        size="small"
                                        placeholder={
                                          values.platform.value === "android"
                                            ? "Package Name"
                                            : "App Name"
                                        }
                                        InputLabelProps={{ shrink: true }}
                                        onChange={(e) => {
                                          e.preventDefault();
                                          const { value } = e.target;

                                          // const regex = /^[a-zA-Z][a-zA-Z\s]*$/;
                                          const regex = /^\S+$/;

                                          if (
                                            !value ||
                                            (regex.test(value.toString()) &&
                                              value.length <= 50)
                                          ) {
                                            setFieldValue(
                                              "package_name",
                                              value
                                            );
                                          } else {
                                            return;
                                          }
                                        }}
                                      />
                                    )}
                                  </Field>
                                  <ErrorMessage
                                    name="package_name"
                                    component="div"
                                    className="text-error text-12 mt-5"
                                  />
                                </FormControl>
                              </Grid>
                              {values?.platform?.value === "ios" && (
                                <Grid item md={4} className="pr-24 w-full">
                                  <FormControl variant="standard" fullWidth>
                                    <Typography className="label d-flex items-center">
                                      App ID
                                      <sup className="asc">*</sup>
                                    </Typography>
                                    <Field name="app_id">
                                      {({ field }) => (
                                        <BootstrapInput
                                          {...field}
                                          disabled={
                                            formEditing
                                              ? menu[2]?.edit_flag !== 1
                                              : menu[2]?.add_flag !== 1
                                          }
                                          fullWidth
                                          id="app_id"
                                          size="small"
                                          placeholder="App ID"
                                          InputLabelProps={{ shrink: true }}
                                          onChange={(e) => {
                                            e.preventDefault();
                                            const { value } = e.target;

                                            // const regex = /^[a-zA-Z][a-zA-Z\s]*$/;
                                            const regex = /^\S+$/;

                                            if (
                                              !value ||
                                              (regex.test(value.toString()) &&
                                                value.length <= 50)
                                            ) {
                                              setFieldValue("app_id", value);
                                            } else {
                                              return;
                                            }
                                          }}
                                        />
                                      )}
                                    </Field>
                                    <ErrorMessage
                                      name="app_id"
                                      component="div"
                                      className="text-error text-12 mt-5"
                                    />
                                  </FormControl>
                                </Grid>
                              )}

                              <Grid item md={4} className="w-full">
                                <FormControl variant="standard" fullWidth>
                                  <Typography className="label d-flex items-center">
                                    Store URL
                                    <sup className="asc">*</sup>
                                  </Typography>
                                  <Field name="store_url">
                                    {({ field }) => (
                                      <BootstrapInput
                                        {...field}
                                        disabled={
                                          formEditing
                                            ? menu[2]?.edit_flag !== 1
                                            : menu[2]?.add_flag !== 1
                                        }
                                        fullWidth
                                        id="store-url"
                                        size="small"
                                        placeholder="Store URL"
                                        InputLabelProps={{ shrink: true }}
                                        onChange={async (e) => {
                                          const value = e.target.value;
                                          const regex = /^\S+$/;

                                          if (
                                            !value ||
                                            (regex.test(value.toString()) &&
                                              value.length <= 200)
                                          ) {
                                            setFieldValue("store_url", value);
                                          } else {
                                            return;
                                          }
                                        }}
                                      />
                                    )}
                                  </Field>
                                  <ErrorMessage
                                    name="store_url"
                                    component="div"
                                    className="text-error text-12 mt-5"
                                  />
                                </FormControl>
                              </Grid>

                              <Grid item md={8} className="pt-24 w-full">
                                <FormControl variant="standard" fullWidth>
                                  <Typography className="label d-flex items-center">
                                    Description
                                    <sup className="asc">*</sup>
                                  </Typography>
                                  <Field name="description">
                                    {({ field }) => (
                                      <BootstrapInput
                                        {...field}
                                        disabled={
                                          formEditing
                                            ? menu[2]?.edit_flag !== 1
                                            : menu[2]?.add_flag !== 1
                                        }
                                        fullWidth
                                        id="description"
                                        size="small"
                                        placeholder="Description"
                                        InputLabelProps={{ shrink: true }}
                                        onChange={(e) => {
                                          e.preventDefault();
                                          const { value } = e.target;

                                          const regex = /^[a-zA-Z][a-zA-Z\s]*$/;

                                          if (
                                            !value ||
                                            value.length <= 200
                                            // (regex.test(value.toString()) &&
                                          ) {
                                            setFieldValue(
                                              "description",
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
                                    name="description"
                                    component="div"
                                    className="text-error text-12 mt-5"
                                  />
                                </FormControl>
                              </Grid>

                              {/* <Grid item md={4} className="pt-24 pr-24 w-full">
                                <FormControl variant="standard" fullWidth>
                                  <Typography className="label d-flex items-center">
                                    Bundle ID
                                    <sup className="asc">*</sup>
                                  </Typography>
                                  <Field name="bundle_id">
                                    {({ field }) => (
                                      <BootstrapInput
                                        {...field}
                                        fullWidth
                                        id="bundle-id"
                                        size="small"
                                        placeholder="Bundle ID"
                                        InputLabelProps={{ shrink: true }}
                                        onChange={async (e) => {
                                          const value = e.target.value;
                                          const regex = /^\S+$/;

                                          if (
                                            !value ||
                                            (regex.test(value.toString()) &&
                                              value.length <= 200)
                                          ) {
                                            setFieldValue("bundle_id", value);
                                          } else {
                                            return;
                                          }
                                        }}
                                      />
                                    )}
                                  </Field>
                                  <ErrorMessage
                                    name="bundle_id"
                                    component="div"
                                    className="text-error text-12 mt-5"
                                  />
                                </FormControl>
                              </Grid> */}

                              {/* <Grid item md={4} className="pt-24 w-full">
                                <FormControl variant="standard" fullWidth>
                                  <Typography className="label d-flex items-center">
                                    Dynamic URL
                                    <sup className="asc">*</sup>
                                  </Typography>
                                  <Field name="dynamic_url">
                                    {({ field }) => (
                                      <BootstrapInput
                                        {...field}
                                        fullWidth
                                        id="dynamic-url"
                                        size="small"
                                        placeholder="Dynamic URL"
                                        InputLabelProps={{ shrink: true }}
                                        onChange={async (e) => {
                                          const value = e.target.value;
                                          const regex = /^\S+$/;

                                          if (
                                            !value ||
                                            (regex.test(value.toString()) &&
                                              value.length <= 200)
                                          ) {
                                            setFieldValue("dynamic_url", value);
                                          } else {
                                            return;
                                          }
                                        }}
                                      />
                                    )}
                                  </Field>
                                  <ErrorMessage
                                    name="dynamic_url"
                                    component="div"
                                    className="text-error text-12 mt-5"
                                  />
                                </FormControl>
                              </Grid> */}
                            </Grid>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                    <Box className="p-20 bg-highlight">
                      <Grid container spacing={2}>
                        {formEditing ? (
                          <>
                            <Grid
                              item
                              md={menu[2]?.edit_flag ? 10 : 11}
                              xs={2}
                            ></Grid>
                            {menu[2]?.edit_flag !== 1 ? (
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
                            {menu[2]?.edit_flag ? (
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
                            {menu[2]?.edit_flag ? (
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
                        ) : (
                          <>
                            <Grid
                              item
                              md={menu[2]?.add_flag ? 10 : 11}
                              xs={2}
                            ></Grid>
                            {menu[2]?.add_flag !== 1 ? (
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
                            {menu[2]?.add_flag ? (
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
                            {menu[2]?.add_flag ? (
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

export default Application;

// const handleAndroidOpen = () => {
//   setOpenAndroid(true);
// };
// const handleAndroidClose = () => {
//   setOpenAndroid(false);
// };
// const handleIOSOpen = () => {
//   setOpenIOS(true);
// };
// const handleIOSClose = () => {
//   setOpenIOS(false);
// };
// const handleWebOpen = () => {
//   setOpenWeb(true);
// };
// const handleWebClose = () => {
//   setOpenWeb(false);
// };
// {
/* )} */
// }
// {
/* {selectedApp?.value === "IOS" && (
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
                  )} */
// }
