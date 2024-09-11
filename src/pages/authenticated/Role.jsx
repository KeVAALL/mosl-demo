/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from "react";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { useTheme } from "@mui/material/styles";
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
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { useTreeViewApiRef } from "@mui/x-tree-view/hooks";
import { BootstrapInput } from "../../utils/Input/textfield";
// third-party
import * as Yup from "yup";
import { useTable, usePagination, useGlobalFilter } from "react-table";

// project-imports
import {
  GlobalFilter,
  TablePagination,
  HidingSelect,
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
  const [openForm, setOpenForm] = useState(false);
  const [submitForm, setSubmitForm] = useState(false);
  const [initialValues, setInitialValues] = useState({
    role_name: "",
    selectedMenus: [],
  });
  const validationSchema = Yup.object().shape({
    role_name: Yup.string().required("Role Name is required"),
    selectedMenus: Yup.array()
      .min(1, "At least one menu must be selected")
      .required("Please select at least one menu"),
  });
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
    setOpenForm(false);
    setFormEditing(false);
    setInitialValues({
      role_name: "",
      selectedMenus: [],
    });
    // setSelectedItems([]);
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
      menuIds: values?.selectedMenus,
      created_by: userProfile?.user_role_id,
      created_by_name: userProfile?.user_name,
    };
    // Handle form submission
    try {
      setSubmitForm(true);

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
      setSubmitForm(false);
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

  // Multi Checkbox
  const toggledItemRef = React.useRef({});
  const apiRef = useTreeViewApiRef();
  const menus = [
    { id: 1, label: "Dashboard" },
    {
      id: 2,
      label: "Project",
    },
    {
      id: 3,
      label: "Application",
    },
    {
      id: 4,
      label: "Dynamic Links",
    },
    { id: 5, label: "Users" },
    { id: 6, label: "Role" },
  ];
  function getItemDescendantsIds(item) {
    const ids = [];
    item.children?.forEach((child) => {
      ids.push(child.id);
      ids.push(...getItemDescendantsIds(child));
    });

    return ids;
  }
  const handleItemSelectionToggle = (event, itemId, isSelected) => {
    toggledItemRef.current[itemId] = isSelected;
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
                        selectedMenus: resp?.menus,
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
                    console.log(row?.original);
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

  // useEffect(() => {
  //   console.log(selectedItems);
  //   if (menuError) {
  //     if (selectedItems?.length < 1) {
  //       setMenuError("Please select menus");
  //     } else {
  //       setMenuError("");
  //     }
  //   }
  // }, [menuError, selectedItems]);

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
              {!openForm && (
                <Button variant="contained" onClick={handleOpen}>
                  Add Role
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
                        <Grid item md={4} className="w-full">
                          <FormControl variant="standard" fullWidth>
                            <Typography className="label d-flex items-center">
                              Menu
                              <sup className="asc">*</sup>
                            </Typography>
                            <RichTreeView
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
                                Object.entries(toggledItemRef.current).forEach(
                                  ([itemId, isSelected]) => {
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
                                  }
                                );

                                const newSelectedItemsWithChildren = Array.from(
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
                              onItemSelectionToggle={handleItemSelectionToggle}
                            />
                            <ErrorMessage
                              name="selectedMenus"
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
