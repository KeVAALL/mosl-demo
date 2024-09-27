/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from "react";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
  useMediaQuery,
} from "@mui/material";

import { BootstrapInput } from "../../utils/Input/textfield";
// third-party
import * as Yup from "yup";
import { useTable, usePagination, useGlobalFilter } from "react-table";

// project-imports
import {
  GlobalFilter,
  TablePagination,
  HeaderSort,
  StyledTableCell,
} from "../../utils/ReactTable/index";
import { useSortBy } from "react-table";
import { tableColumns, VisibleColumn } from "../../data/Role";
import { ApiService } from "../../utils/api/apiCall";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { HtmlLightTooltip } from "../../utils/components/Tooltip";

function Role() {
  const { userProfile } = useSelector((state) => state.user);
  const { menu } = useSelector((state) => state.menu);
  const [openForm, setOpenForm] = useState(false);
  const [submitRoleForm, setSubmitRoleForm] = useState(false);

  const [tableData, setTableData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState({});
  const [formEditing, setFormEditing] = useState(false);
  const theme = useTheme();
  const matcheSM = useMediaQuery(theme.breakpoints.down("sm"));
  // Delete Modal
  const handleDeleteConfirmation = () => {
    setOpenDeleteModal(!openDeleteModal);
  };
  const handleOpen = () => {
    setOpenForm(true);
  };
  const handleClose = () => {
    // setOpenForm(false);
    // setFormEditing(false);
    // setInitialValues({
    //   role_name: "",
    //   selectedMenus: [],
    // });
    window.location.reload();
  };
  async function getRoles() {
    try {
      setLoadingData(true);
      const result = await ApiService({}, "role/get-roles");

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

    const reqdata = {
      role_id: formEditing ? values?.role_id : 0,
      role_name: values?.role_name,
      menuIds: values?.menuIds,
      created_by: userProfile?.user_role_id,
      created_by_name: userProfile?.user_name,
    };
    // Handle form submission
    try {
      setSubmitRoleForm(true);

      const result = await ApiService(reqdata, "role/create");

      console.log(result);

      if (result?.status === 201) {
        toast.success(
          `Role${formEditing ? " Updated Successfully" : " Added"}`
        );
        setOpenForm(false);
        setFormEditing(false);
        setInitialValues({
          role_name: "",
          selectedMenus: [],
        });
        getRoles();
      }

      // return result;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setSubmitRoleForm(false);
    }
  };
  const deleteRoles = async () => {
    console.log(deleteItem);
    const reqdata = {
      ...deleteItem,
      menuIds: [],
      is_deleted: 1,
      is_active: 0,
    };
    // Handle form submission
    try {
      setDeleteItem({
        ...deleteItem,
        isDeleting: true,
      });

      const result = await ApiService(reqdata, "role/create");

      if (result?.status === 201) {
        toast.error("Role Deleted");
        handleDeleteConfirmation();
        getRoles();
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

  const menus = [
    {
      value: 1, // Previously id
      label: "Dashboard",
      display_flag: 0,
      add_flag: 0,
      edit_flag: 0,
      delete_flag: 0,
    },
    {
      value: 2, // Previously id
      label: "Project",
      display_flag: 0,
      add_flag: 0,
      edit_flag: 0,
      delete_flag: 0,
    },
    {
      value: 3, // Previously id
      label: "Application",
      display_flag: 0,
      add_flag: 0,
      edit_flag: 0,
      delete_flag: 0,
    },
    {
      value: 4, // Previously id
      label: "Dynamic Links",
      display_flag: 0,
      add_flag: 0,
      edit_flag: 0,
      delete_flag: 0,
    },
    {
      value: 5,
      label: "Users",
      display_flag: 0,
      add_flag: 0,
      edit_flag: 0,
      delete_flag: 0,
    },
    {
      value: 6,
      label: "Role",
      display_flag: 0,
      add_flag: 0,
      edit_flag: 0,
      delete_flag: 0,
    },
  ];
  const getInitialValues = () => ({
    role_name: "", // Role name field
    menuIds: menus.map((menu) => {
      return {
        menu_id: menu.value,
        display_flag: menu.display_flag,
        add_flag: menu.add_flag,
        edit_flag: menu.edit_flag,
        delete_flag: menu.delete_flag,
      };
    }),
    // ...menus.reduce((acc, menu) => {
    //   acc[menu.value] = {
    //     menuId: menu.value,
    //     display_flag: menu.display_flag,
    //     add_flag: menu.add_flag,
    //     edit_flag: menu.edit_flag,
    //     delete_flag: menu.delete_flag,
    //   };
    //   return acc;
    // }, {}),
  });
  const [initialValues, setInitialValues] = useState(getInitialValues());
  const validationSchema = Yup.object().shape({
    role_name: Yup.string().required("Role name is required"),
    menuIds: Yup.array().of(
      Yup.object().shape({
        menu_id: Yup.number().required(),
        display_flag: Yup.boolean(),
        add_flag: Yup.boolean(),
        edit_flag: Yup.boolean(),
        delete_flag: Yup.boolean(),
      })
    ),
  });
  // ...menus.reduce((acc, menu) => {
  //   acc[menu.value] = Yup.object().shape({
  //     menuId: Yup.number(),
  //     display_flag: Yup.boolean(),
  //     add_flag: Yup.boolean(),
  //     edit_flag: Yup.boolean(),
  //     delete_flag: Yup.boolean(),
  //   });

  //   // .test(
  //   //   "at-least-one-checked",
  //   //   "At least one permission (Display, Add, Edit, Delete) must be selected.",
  //   //   (values) =>
  //   //     values.display || values.add || values.edit || values.delete
  //   // );

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
              <HtmlLightTooltip
                title={menu[4]?.edit_flag !== 1 ? "View" : "Edit"}
                placement="top"
                arrow
              >
                <LoadingButton
                  loading={isEditing}
                  disabled={isEditing}
                  className="mui-icon-button"
                  variant="outlined"
                  startIcon={
                    menu[4]?.edit_flag !== 1 ? (
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
                        { role_id: row?.original?.role_id },
                        "role/getone-role"
                      );

                      const resp = result?.data;
                      console.log(resp);

                      const newMap = {
                        ...resp,
                        menuIds: resp?.menus,
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

              {menu[4]?.delete_flag ? (
                <HtmlLightTooltip title="Delete" placement="top" arrow>
                  <LoadingButton
                    className="mui-icon-button"
                    variant="outlined"
                    startIcon={<DeleteForeverOutlinedIcon />}
                    onClick={() => {
                      console.log(row?.original);
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
    getRoles();
  }, []);

  return (
    <>
      <Grid container spacing={4} sx={{ width: "100%" }}>
        <Grid item xs={12}>
          <Grid container display="flex" alignItems="center">
            <Grid item xs={6}>
              <Typography variant="h5" fontWeight={500}>
                Role Management
              </Typography>
              <Typography variant="caption" sx={{ color: "text.grey", mt: 2 }}>
                Manage Roles and their Associate Menus
              </Typography>
            </Grid>
            <Grid item xs={6} display="flex" justifyContent="flex-end">
              {menu[4]?.add_flag ? (
                !openForm && (
                  <Button variant="contained" onClick={handleOpen}>
                    Add Role
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
                    Are you sure you want to delete {deleteItem?.role_name}?
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
                    onClick={deleteRoles}
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
                  <Grid item md={3} xs={6}></Grid>
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
                submitForm,
                validateForm,
                values,
              }) => (
                <Form onSubmit={handleSubmit}>
                  <Paper elevation={3}>
                    <Box sx={{}}>
                      <Grid
                        container
                        spacing={2.5}
                        mt={1}
                        className="pl-20 pr-20 pb-20"
                      >
                        <Grid item md={4} className="w-full">
                          <FormControl variant="standard" fullWidth>
                            <Typography className="label d-flex items-center">
                              Role Name
                              <sup className="asc">*</sup>
                            </Typography>
                            <Field name="role_name">
                              {({ field }) => (
                                <BootstrapInput
                                  {...field}
                                  disabled={
                                    formEditing
                                      ? menu[4]?.edit_flag !== 1
                                      : menu[4]?.add_flag !== 1
                                  }
                                  fullWidth
                                  id="role_name"
                                  size="small"
                                  name="role_name"
                                  placeholder="Role Name"
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  onChange={(e) => {
                                    e.preventDefault();
                                    const { value } = e.target;

                                    const regex = /^[a-zA-Z][a-zA-Z\s]*$/;

                                    if (
                                      !value ||
                                      (regex.test(value.toString()) &&
                                        value.length <= 50)
                                    ) {
                                      setFieldValue("role_name", value);
                                    } else {
                                      return;
                                    }
                                  }}
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="role_name"
                              component="div"
                              className="text-error text-12 mt-5"
                            />
                          </FormControl>
                        </Grid>
                        {!matcheSM && (
                          <>
                            <Grid item xs={4}></Grid>
                            <Grid item xs={4}></Grid>
                          </>
                        )}
                        <Grid item md={12} className="w-full">
                          <FormControl variant="standard" fullWidth>
                            <Typography className="label d-flex items-center">
                              Menu
                              <sup className="asc">*</sup>
                            </Typography>
                            <Table>
                              {/* Table Header */}
                              <TableHead>
                                <TableRow>
                                  <StyledTableCell>Role Name</StyledTableCell>
                                  <StyledTableCell
                                    align="center"
                                    style={{ width: "8%" }}
                                  >
                                    Display
                                  </StyledTableCell>
                                  <StyledTableCell
                                    align="center"
                                    style={{ width: "8%" }}
                                  >
                                    Add
                                  </StyledTableCell>
                                  <StyledTableCell
                                    align="center"
                                    style={{ width: "8%" }}
                                  >
                                    Edit
                                  </StyledTableCell>
                                  <StyledTableCell
                                    align="center"
                                    style={{ width: "8%" }}
                                  >
                                    Delete
                                  </StyledTableCell>
                                </TableRow>
                              </TableHead>

                              {/* Table Body */}
                              <TableBody className="table_body_main">
                                {menus.map((menu, index) => (
                                  <TableRow key={menu.value}>
                                    <TableCell>{menus[index].label}</TableCell>

                                    <TableCell align="center">
                                      <Field
                                        name={`menuIds[${index}].display_flag`}
                                      >
                                        {({ field }) => (
                                          <Checkbox
                                            checked={field.value === 1}
                                            onChange={(e) =>
                                              setFieldValue(
                                                `menuIds[${index}].display_flag`,
                                                e.target.checked ? 1 : 0
                                              )
                                            }
                                          />
                                        )}
                                      </Field>
                                    </TableCell>

                                    <TableCell align="center">
                                      <Field
                                        name={`menuIds[${index}].add_flag`}
                                      >
                                        {({ field }) => (
                                          <Checkbox
                                            checked={field.value === 1}
                                            onChange={(e) =>
                                              setFieldValue(
                                                `menuIds[${index}].add_flag`,
                                                e.target.checked ? 1 : 0
                                              )
                                            }
                                          />
                                        )}
                                      </Field>
                                    </TableCell>

                                    <TableCell align="center">
                                      <Field
                                        name={`menuIds[${index}].edit_flag`}
                                      >
                                        {({ field }) => (
                                          <Checkbox
                                            checked={field.value === 1}
                                            onChange={(e) =>
                                              setFieldValue(
                                                `menuIds[${index}].edit_flag`,
                                                e.target.checked ? 1 : 0
                                              )
                                            }
                                          />
                                        )}
                                      </Field>
                                    </TableCell>

                                    <TableCell align="center">
                                      <Field
                                        name={`menuIds[${index}].delete_flag`}
                                      >
                                        {({ field }) => (
                                          <Checkbox
                                            checked={field.value === 1}
                                            onChange={(e) =>
                                              setFieldValue(
                                                `menuIds[${index}].delete_flag`,
                                                e.target.checked ? 1 : 0
                                              )
                                            }
                                          />
                                        )}
                                      </Field>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                            <ErrorMessage
                              name="menuIds"
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
                              md={menu[4]?.edit_flag ? 10 : 11}
                              xs={2}
                            ></Grid>
                            {menu[4]?.edit_flag !== 1 ? (
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
                            {menu[4]?.edit_flag ? (
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
                            {menu[4]?.edit_flag ? (
                              <Grid item md={1} xs={5}>
                                <LoadingButton
                                  loading={submitRoleForm}
                                  disabled={submitRoleForm}
                                  fullWidth
                                  type="submit"
                                  variant="contained"
                                  sx={{ backgroundColor: "primary.main" }}
                                  onClick={async (e) => {
                                    e.preventDefault();

                                    // Manually trigger form validation
                                    const errors = await validateForm();
                                    console.log(errors);
                                    // Check if there are validation errors
                                    if (Object.keys(errors).length > 0) {
                                      if (errors.role_name) {
                                        toast.error(errors.role_name);
                                      }
                                      // Check for selected permissions

                                      // Check if there are any permission errors
                                      // menus.forEach((menu) => {
                                      //   if (errors[menu.value]) {
                                      //     toast.error(errors[menu.value].message);
                                      //   }
                                      // });
                                      // return;
                                      return;
                                    }
                                    const hasPermissions = values.menuIds.some(
                                      (menu) =>
                                        menu.display_flag ||
                                        menu.add_flag ||
                                        menu.edit_flag ||
                                        menu.delete_flag
                                    );

                                    if (!hasPermissions) {
                                      toast.error(
                                        "At least one permission must be selected!"
                                      );
                                      return;
                                    }

                                    // If validation passes, submit the form
                                    await submitForm();
                                  }}
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
                              md={menu[4]?.add_flag ? 10 : 11}
                              xs={2}
                            ></Grid>
                            {menu[4]?.add_flag !== 1 ? (
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
                            {menu[4]?.add_flag ? (
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
                            {menu[4]?.add_flag ? (
                              <Grid item md={1} xs={5}>
                                <LoadingButton
                                  loading={submitRoleForm}
                                  disabled={submitRoleForm}
                                  fullWidth
                                  type="submit"
                                  variant="contained"
                                  sx={{ backgroundColor: "primary.main" }}
                                  onClick={async (e) => {
                                    e.preventDefault();

                                    // Manually trigger form validation
                                    const errors = await validateForm();
                                    console.log(errors);
                                    // Check if there are validation errors
                                    if (Object.keys(errors).length > 0) {
                                      if (errors.role_name) {
                                        toast.error(errors.role_name);
                                      }

                                      return;
                                    }
                                    const hasPermissions = values.menuIds.some(
                                      (menu) =>
                                        menu.display_flag ||
                                        menu.add_flag ||
                                        menu.edit_flag ||
                                        menu.delete_flag
                                    );

                                    if (!hasPermissions) {
                                      toast.error(
                                        "At least one permission must be selected!"
                                      );
                                      return;
                                    }

                                    await submitForm();
                                  }}
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

export default Role;

// const handleSelectedItemsChange = (event, newSelectedItems) => {
//   setSelectedItems(newSelectedItems);

//   // Select / unselect the children of the toggled item
//   const itemsToSelect = [];
//   const itemsToUnSelect = {};
//   Object.entries(toggledItemRef.current).forEach(([itemId, isSelected]) => {
//     const item = apiRef.current.getItem(itemId);
//     if (isSelected) {
//       itemsToSelect.push(...getItemDescendantsIds(item));
//     } else {
//       getItemDescendantsIds(item).forEach((descendantId) => {
//         itemsToUnSelect[descendantId] = true;
//       });
//     }
//   });

//   const newSelectedItemsWithChildren = Array.from(
//     new Set(
//       [...newSelectedItems, ...itemsToSelect].filter(
//         (itemId) => !itemsToUnSelect[itemId]
//       )
//     )
//   );

//   setSelectedItems(newSelectedItemsWithChildren);

//   toggledItemRef.current = {};
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
/* <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Username</StyledTableCell>
                  <StyledTableCell>Role</StyledTableCell>
                  <StyledTableCell>Description</StyledTableCell>
                  <StyledTableCell align="right">Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tablerows.map((row) => (
                  <StyledTableRow key={row.name}>
                    <StyledTableCell component="th" scope="row">
                      {row.name}
                    </StyledTableCell>
                    <StyledTableCell>{row.role}</StyledTableCell>
                    <StyledTableCell>{row.description}</StyledTableCell>
                    <StyledTableCell align="right">
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={2}
                      >
                        <Button
                          variant="outlined"
                          startIcon={<VisibilityOutlined />}
                        >
                          View
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<BorderColorOutlinedIcon />}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<DeleteForeverOutlinedIcon />}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table> */
// }
{
  /* <RichTreeView
                                multiSelect
                                checkboxSelection
                                apiRef={apiRef}
                                items={menus}
                                selectedItems={values.selectedMenus}
                                onSelectedItemsChange={(
                                  event,
                                  newSelectedItems
                                ) => {
                                  setFieldValue(
                                    "selectedMenus",
                                    newSelectedItems
                                  );

                                  // Select / unselect the children of the toggled item
                                  const itemsToSelect = [];
                                  const itemsToUnSelect = {};
                                  Object.entries(
                                    toggledItemRef.current
                                  ).forEach(([itemId, isSelected]) => {
                                    const item = apiRef.current.getItem(itemId);
                                    if (isSelected) {
                                      itemsToSelect.push(
                                        ...getItemDescendantsIds(item)
                                      );
                                    } else {
                                      getItemDescendantsIds(item).forEach(
                                        (descendantId) => {
                                          itemsToUnSelect[descendantId] = true;
                                        }
                                      );
                                    }
                                  });

                                  const newSelectedItemsWithChildren =
                                    Array.from(
                                      new Set(
                                        [
                                          ...newSelectedItems,
                                          ...itemsToSelect,
                                        ].filter(
                                          (itemId) => !itemsToUnSelect[itemId]
                                        )
                                      )
                                    );

                                  setFieldValue(
                                    "selectedMenus",
                                    newSelectedItemsWithChildren
                                  );

                                  toggledItemRef.current = {};
                                }}
                                onItemSelectionToggle={
                                  handleItemSelectionToggle
                                }
                              /> */
}
