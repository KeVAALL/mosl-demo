/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from "react";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
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
} from "@mui/material";
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
import { tableColumns, tableData, VisibleColumn } from "../../data/Role";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { ApiService } from "../../utils/api/apiCall";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { ErrorMessage, Field, Form, Formik } from "formik";

function Role() {
  const { userProfile } = useSelector((state) => state.user);
  const [open, setOpen] = React.useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [submitForm, setSubmitForm] = useState(false);
  const [initialValues, setInitialValues] = useState({
    role_name: "",
  });
  const validationSchema = Yup.object().shape({
    role_name: Yup.string().required("Name is required"),
  });
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [tableData, setTableData] = useState([]);
  const [loadingData, setLoadingData] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [menuError, setMenuError] = useState("");
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
    });
    setSelectedItems([]);
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
    if (selectedItems?.length < 1) {
      setMenuError("Please select menus");
      return;
    }
    const reqdata = {
      ...values,
      assign_menu: selectedItems,
      created_by: userProfile?.user_role_id,
      created_by_name: userProfile?.user_name,
    };
    // Handle form submission
    try {
      setSubmitForm(true);

      const result = await ApiService(reqdata, "role/create");

      console.log(result);

      if (result?.status === 201) {
        toast.success(`User${formEditing ? " Edited" : " Added"}`);
        setOpenForm(false);
        setFormEditing(false);
        setInitialValues({
          role_name: "",
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

  const menus = [
    { id: "1", label: "Dashboard" },
    {
      id: "2",
      label: "Project",
    },
    {
      id: "3",
      label: "Application",
    },
    {
      id: "4",
      label: "Dynamic Links",
    },
    { id: "5", label: "Users" },
    { id: "6", label: "Role" },
  ];
  function getItemDescendantsIds(item) {
    const ids = [];
    item.children?.forEach((child) => {
      ids.push(child.id);
      ids.push(...getItemDescendantsIds(child));
    });

    return ids;
  }
  const toggledItemRef = React.useRef({});
  const apiRef = useTreeViewApiRef();
  const handleItemSelectionToggle = (event, itemId, isSelected) => {
    toggledItemRef.current[itemId] = isSelected;
  };
  const handleSelectedItemsChange = (event, newSelectedItems) => {
    setSelectedItems(newSelectedItems);

    // Select / unselect the children of the toggled item
    const itemsToSelect = [];
    const itemsToUnSelect = {};
    Object.entries(toggledItemRef.current).forEach(([itemId, isSelected]) => {
      const item = apiRef.current.getItem(itemId);
      if (isSelected) {
        itemsToSelect.push(...getItemDescendantsIds(item));
      } else {
        getItemDescendantsIds(item).forEach((descendantId) => {
          itemsToUnSelect[descendantId] = true;
        });
      }
    });

    const newSelectedItemsWithChildren = Array.from(
      new Set(
        [...newSelectedItems, ...itemsToSelect].filter(
          (itemId) => !itemsToUnSelect[itemId]
        )
      )
    );

    setSelectedItems(newSelectedItemsWithChildren);

    toggledItemRef.current = {};
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
              <Tooltip title="View" placement="top" arrow>
                <Button
                  className="mui-icon-button"
                  variant="outlined"
                  startIcon={<VisibilityOutlined />}
                />
              </Tooltip>
              <Tooltip title="Edit" placement="top" arrow>
                <LoadingButton
                  loading={isEditing}
                  disabled={isEditing}
                  className="mui-icon-button"
                  variant="outlined"
                  startIcon={<BorderColorOutlinedIcon />}
                  onClick={async () => {
                    console.log(row);
                    console.log(tableData);
                  }}
                />
              </Tooltip>

              <Tooltip title="Delete" placement="top" arrow>
                <Button
                  className="mui-icon-button"
                  variant="outlined"
                  startIcon={<DeleteForeverOutlinedIcon />}
                  onClick={() => {
                    setDeleteItem(row?.original);
                    handleDeleteConfirmation();
                  }}
                />
              </Tooltip>
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
    console.log(selectedItems);
    if (menuError) {
      if (selectedItems?.length < 1) {
        setMenuError("Please select menus");
      } else {
        setMenuError("");
      }
    }
  }, [selectedItems]);

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
            <TableContainer component={Paper}>
              <Grid container spacing={2} px={2} py={2}>
                <Grid item md={2} xs={6}>
                  <GlobalFilter
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
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
                                      regex.test(value.toString())
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
                              selectedItems={selectedItems}
                              onSelectedItemsChange={handleSelectedItemsChange}
                              onItemSelectionToggle={handleItemSelectionToggle}
                            />
                            {menuError ? (
                              <div className="text-error text-12 mt-5">
                                {menuError}
                              </div>
                            ) : (
                              <></>
                            )}
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

export default Role;

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
