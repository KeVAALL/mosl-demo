/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from "react";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { BootstrapInput } from "../../utils/Input/textfield";
// third-party
import * as Yup from "yup";
import { useTable, usePagination, useGlobalFilter } from "react-table";

// project-imports
import {
  TablePagination,
  HeaderSort,
  GlobalFilter,
  HidingSelect,
} from "../../utils/ReactTable/index";
import { useSortBy } from "react-table";
import { tableColumns, VisibleColumn } from "../../data/Project";
import { CustomSelect } from "../../utils/Input/reactSelect";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { toast } from "react-toastify";
import { ApiService } from "../../utils/api/apiCall";
import { useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";

function Project() {
  const [openForm, setOpenForm] = useState(false);
  const [checkUniqueID, setCheckUniqueID] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [submitForm, setSubmitForm] = useState(false);
  const [initialValues, setInitialValues] = useState({
    project_name: "",
    project_id: "",
    project_owner: null, // Assuming user is selected from CustomSelect
    project_description: "",
  });
  const [tableData, setTableData] = useState([]);
  const [ownerDropdown, setOwnerDropdown] = useState([]);
  const [loadingData, setLoadingData] = useState([]);
  const { userProfile } = useSelector((state) => state.user);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState({});
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

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
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
  const checkProjectUnique = async (value) => {
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
  };
  const onSubmit = async (values) => {
    console.log(values);
    const reqdata = {
      ...values,
      project_owner: values?.project_owner?.value,
      created_by: userProfile?.user_role_id,
      created_by_name: userProfile?.user_name,
    };
    // Handle form submission
    try {
      setSubmitForm(true);

      const result = await ApiService(reqdata, "project/create");

      console.log(result);

      if (result?.status === 201) {
        toast.success("Project Added");
        setOpenForm(false);
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
  // Form
  const handleOpen = () => {
    setSuccessMessage("");
    setOpenForm(true);
  };
  const handleClose = () => {
    setSuccessMessage("");
    setOpenForm(false);
    setInitialValues({
      project_name: "",
      project_id: "",
      project_owner: null,
      project_description: "",
    });
  };
  // Table
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
  const columns = useMemo(() => tableColumns, []);
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

  useEffect(() => {
    getOwnerDropdown();
  }, []);
  useEffect(() => {
    getProjects();
  }, []);

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
              <Dialog
                open={openDeleteModal}
                aria-labelledby="responsive-dialog-title"
                PaperProps={{
                  style: {
                    width: "500px",
                  },
                }}
              >
                <DialogTitle id="responsive-dialog-title">
                  {"Are you sure?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText color="black">
                    Delete {deleteItem?.project_name}?
                  </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ display: "flex", gap: "10px" }}>
                  <Button autoFocus onClick={handleDeleteConfirmation}>
                    Cancel
                  </Button>
                  <LoadingButton
                    loading={deleteItem?.isDeleting}
                    disabled={deleteItem?.isDeleting}
                    autoFocus
                    variant="outlined"
                    onClick={async () => {
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

                        const result = await ApiService(
                          reqdata,
                          "project/create"
                        );

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
                    }}
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
                                      <LoadingButton
                                        loading={row?.original?.isEditing}
                                        disabled={row?.original?.isEditing}
                                        className="mui-icon-button"
                                        variant="outlined"
                                        startIcon={<BorderColorOutlinedIcon />}
                                        onClick={async () => {
                                          console.log(row);
                                          console.log(tableData);
                                          try {
                                            // Find the index of the matched element in the tableData array
                                            const updatedTableData =
                                              tableData.map((item) =>
                                                item.id === row.original.id
                                                  ? { ...item, isEditing: true }
                                                  : item
                                              );

                                            // Set the updated tableData state
                                            setTableData(updatedTableData);

                                            const result = await ApiService(
                                              { id: row?.original?.id },
                                              "project/getone-project"
                                            );

                                            console.log(result);
                                            const resp = result?.data[0];

                                            const newMap = {
                                              ...resp,
                                              project_owner:
                                                ownerDropdown?.filter(
                                                  (user) =>
                                                    user?.value ===
                                                    resp?.project_owner
                                                )[0],
                                            };

                                            setInitialValues(newMap);
                                            setOpenForm(true);
                                          } catch (error) {
                                            toast.error(
                                              error?.response?.data?.message
                                            );
                                          } finally {
                                            // setIsEditing(false);
                                            // Reset the isEditing state for the matched element
                                            const finalTableData =
                                              tableData.map((item) =>
                                                item.id === row.original.id
                                                  ? {
                                                      ...item,
                                                      isEditing: false,
                                                    }
                                                  : item
                                              );

                                            // Set the final updated tableData state
                                            setTableData(finalTableData);
                                          }
                                        }}
                                      />
                                    </Tooltip>

                                    <Tooltip
                                      title="Delete"
                                      placement="top"
                                      arrow
                                    >
                                      <Button
                                        className="mui-icon-button"
                                        variant="outlined"
                                        startIcon={
                                          <DeleteForeverOutlinedIcon />
                                        }
                                        onClick={() => {
                                          console.log(row?.original);
                                          setDeleteItem(row?.original);
                                          handleDeleteConfirmation();
                                        }}
                                      />
                                    </Tooltip>
                                  </Stack>
                                </StyledTableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={columns.length + 1}
                              align="center"
                            >
                              No Data
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
              }) => (
                <Form onSubmit={handleSubmit}>
                  <Paper elevation={3}>
                    <Box sx={{ borderBottom: "1px solid #9e9e9e" }}>
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
                                    setFieldValue("project_id", value);
                                    setSuccessMessage("");
                                    if (value?.length > 15) {
                                      const response = await checkProjectUnique(
                                        value
                                      );
                                      if (!response?.data?.result_flag) {
                                        setSuccessMessage(
                                          "Project ID is valid"
                                        );
                                        setFieldTouched(
                                          "project_id",
                                          true,
                                          false
                                        );
                                      } else {
                                        setFieldError(
                                          "project_id",
                                          "Invalid Project ID"
                                        );
                                      }
                                    }
                                  }}
                                  endAdornment={
                                    <InputAdornment position="end">
                                      {checkUniqueID ? (
                                        <CircularProgress
                                          sx={{
                                            color: "#757575",
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

export default Project;

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
