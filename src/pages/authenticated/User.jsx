/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import {
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
// third-party
import * as Yup from "yup";
// project-imports
import { BootstrapInput } from "../../utils/Input/textfield";
import { CustomSelect } from "../../utils/Input/reactSelect";
import {
  GlobalFilter,
  TablePagination,
  HidingSelect,
  HeaderSort,
  StyledTableCell,
} from "../../utils/ReactTable/index";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import { useSortBy } from "react-table";
import { tableColumns, VisibleColumn } from "../../data/User";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { ApiService } from "../../utils/api/apiCall";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { HtmlLightTooltip } from "../../utils/components/Tooltip";

function User() {
  const { userProfile } = useSelector((state) => state.user);
  const [openForm, setOpenForm] = useState(false);
  const [submitForm, setSubmitForm] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    role_id: null,
  });
  const [tableData, setTableData] = useState([]);
  const [roleDropdown, setRoleDropdown] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState({});
  const [formEditing, setFormEditing] = useState(false);
  // Validation
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .trim()
      .email("Invalid email")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .matches(/[0-9]/, "Password must contain at least 1 numeric character")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least 1 special character"
      )
      .required("Password is required"),
    phone_number: Yup.string().required("Phone Number is required"),
    role_id: Yup.object().required("Role is required"),
  });
  const handleOpen = () => {
    setOpenForm(true);
  };
  const handleClose = () => {
    setOpenForm(false);
    setFormEditing(false);
    setInitialValues({
      name: "",
      email: "",
      password: "",
      phone_number: "",
      role_id: null,
    });
  };
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  // Delete Modal
  const handleDeleteConfirmation = () => {
    setOpenDeleteModal(!openDeleteModal);
  };
  // CRUD
  async function getUsers() {
    try {
      setLoadingData(true);
      const result = await ApiService(
        { user_id: 0, name: "" },
        "user/getall-users"
      );

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
  async function getRoleDropdown() {
    try {
      const result = await ApiService({}, "role/get-roles");

      console.log(result);
      const newMap = result?.data?.map((role) => {
        return { label: role?.role_name, value: role?.role_id };
      });

      setRoleDropdown(newMap);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
  const onSubmit = async (values) => {
    console.log(values);
    const reqdata = {
      ...values,
      role_id: values?.role_id?.value,
      created_by: userProfile?.user_role_id,
      created_by_name: userProfile?.user_name,
    };
    // Handle form submission
    try {
      setSubmitForm(true);

      const result = await ApiService(reqdata, "user/createuser");

      console.log(result);

      if (result?.status === 201) {
        toast.success(`User${formEditing ? " Edited" : " Added"}`);
        setOpenForm(false);
        setFormEditing(false);
        setInitialValues({
          name: "",
          email: "",
          password: "", // Assuming user is selected from CustomSelect
          phone_number: "",
          role_id: null,
        });
        getUsers();
      }

      // return result;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setSubmitForm(false);
    }
  };
  const deleteUser = async () => {
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

      const result = await ApiService(reqdata, "user/createuser");

      if (result?.status === 201) {
        toast.error("User Deleted");
        handleDeleteConfirmation();
        getUsers();
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
        accessor: "user_id",
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
                      setIsEditing(true);

                      const result = await ApiService(
                        {
                          user_id: row?.original?.user_id,
                          name: row?.original?.user_name,
                        },
                        "user/getall-users"
                      );
                      console.log(result);
                      const resp = result?.data[0];

                      const newMap = {
                        user_id: resp?.user_id,
                        name: resp?.user_name,
                        email: resp?.user_email,
                        password: resp?.user_password,
                        phone_number: resp?.user_phone_number,
                        role_id: roleDropdown?.find(
                          (user) => user?.value === resp?.user_role_id
                        ),
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
    [tableData, roleDropdown]
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
    getRoleDropdown();
  }, []);
  useEffect(() => {
    getUsers();
  }, []);

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
                  {"Are you sure ?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText color="black">
                    Delete {deleteItem?.user_name}?
                  </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ display: "flex", gap: "10px" }}>
                  <Button autoFocus onClick={handleDeleteConfirmation}>
                    Cancel
                  </Button>
                  <LoadingButton
                    loading={deleteItem?.isDeleting}
                    disabled={deleteItem?.isDeleting}
                    variant="outlined"
                    onClick={deleteUser}
                    autoFocus
                  >
                    Delete
                  </LoadingButton>
                </DialogActions>
              </Dialog>
              <TableContainer component={Paper}>
                <Grid container spacing={2} px={2} py={2}>
                  <Grid item md={2} xs={6}>
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
                        <Grid item md={4} className="w-full">
                          <FormControl variant="standard" fullWidth>
                            <Typography className="label d-flex items-center">
                              Name
                              <sup className="asc">*</sup>
                            </Typography>
                            <Field name="name">
                              {({ field }) => (
                                <BootstrapInput
                                  {...field}
                                  fullWidth
                                  id="name"
                                  size="small"
                                  placeholder="Name"
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  onChange={(e) => {
                                    e.preventDefault();
                                    const { value } = e.target;

                                    const regex = /^[a-zA-Z][a-zA-Z\s]*$/;

                                    if (
                                      !value ||
                                      regex.test(value.toString())
                                    ) {
                                      setFieldValue("name", value);
                                    } else {
                                      return;
                                    }
                                  }}
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="name"
                              component="div"
                              className="text-error text-12 mt-5"
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={4} className="w-full">
                          <FormControl variant="standard" fullWidth>
                            <Typography className="label d-flex items-center">
                              Email
                              <sup className="asc">*</sup>
                            </Typography>
                            <Field name="email">
                              {({ field }) => (
                                <BootstrapInput
                                  {...field}
                                  fullWidth
                                  id="email"
                                  size="small"
                                  placeholder="Email"
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  onChange={(e) => {
                                    e.preventDefault();
                                    const { value } = e.target;

                                    const regex = /[^-\s]/;

                                    if (
                                      !value ||
                                      regex.test(value.toString())
                                    ) {
                                      setFieldValue("email", value);
                                    } else {
                                      return;
                                    }
                                  }}
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="email"
                              component="div"
                              className="text-error text-12 mt-5"
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={4} className="w-full">
                          <FormControl variant="standard" fullWidth>
                            <Typography className="label d-flex items-center">
                              Password
                              <sup className="asc">*</sup>
                            </Typography>
                            <Field name="password">
                              {({ field }) => (
                                <BootstrapInput
                                  {...field}
                                  fullWidth
                                  id="password"
                                  type={showPassword ? "text" : "password"}
                                  size="small"
                                  placeholder="Password"
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  onChange={async (e) => {
                                    const value = e.target.value;
                                    const regex = /^\S+$/;

                                    if (
                                      !value ||
                                      regex.test(value.toString())
                                    ) {
                                      setFieldValue("password", value);
                                    } else {
                                      return;
                                    }
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
                              )}
                            </Field>
                            <ErrorMessage
                              name="password"
                              component="div"
                              className="text-error text-12 mt-5"
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={4} className="w-full">
                          <FormControl variant="standard" fullWidth>
                            <Typography className="label d-flex items-center">
                              Phone Number
                              <sup className="asc">*</sup>
                            </Typography>
                            <Field name="phone_number">
                              {({ field }) => (
                                <BootstrapInput
                                  {...field}
                                  fullWidth
                                  id="phone_number"
                                  size="small"
                                  placeholder="Phone Number"
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  onChange={(e) => {
                                    e.preventDefault();
                                    const { value } = e.target;

                                    // Regular expression to allow only numbers
                                    const regex = /^[0-9\b]+$/;

                                    if (
                                      !value ||
                                      (regex.test(value.toString()) &&
                                        value.length <= 10)
                                    ) {
                                      setFieldValue("phone_number", value);
                                    } else {
                                      return;
                                    }
                                  }}
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="phone_number"
                              component="div"
                              className="text-error text-12 mt-5"
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={4} className="w-full">
                          <FormControl variant="standard" fullWidth>
                            <Typography className="label d-flex items-center">
                              Role
                              <sup className="asc">*</sup>
                            </Typography>
                            <Field name="role_id">
                              {({ field }) => (
                                <CustomSelect
                                  {...field}
                                  options={roleDropdown}
                                  placeholder="Select Role"
                                  id="role_id"
                                  isSearchable={false}
                                  onChange={(selectedOption) =>
                                    setFieldValue("role_id", selectedOption)
                                  }
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="role_id"
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

export default User;

// const style = {
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
// {
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
                </Grid> */
// }
// {
/* <Grid item md={5} xs={0}></Grid>
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
// }
