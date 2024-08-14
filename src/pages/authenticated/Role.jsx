/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from "react";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
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
} from "@mui/material";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { useTreeViewApiRef } from "@mui/x-tree-view/hooks";
import { BootstrapInput } from "../../utils/Input/textfield";
// third-party
import { useTable, usePagination, useGlobalFilter } from "react-table";

// project-imports
import {
  GlobalFilter,
  TablePagination,
  HidingSelect,
  HeaderSort,
} from "../../utils/ReactTable/index";
import { useSortBy } from "react-table";
import { tableColumns, tableData, VisibleColumn } from "../../data/Role";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";

function Role() {
  const [open, setOpen] = React.useState(false);
  const [openForm, setOpenForm] = useState(false);
  const handleOpen = () => {
    // setOpen(true);
    setOpenForm(true);
  };
  const handleClose = () => {
    // setOpen(false);
    setOpenForm(false);
  };

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
  // const StyledTableRow = styled(TableRow)(({ theme }) => ({
  //   // "&:nth-of-type(odd)": {
  //   //   backgroundColor: theme.palette.action.hover,
  //   // },
  //   // hide last border
  //   "&:last-child td, &:last-child th": {
  //     border: 0,
  //   },
  // }));

  const menus = [
    {
      id: "Admin",
      label: "Admin",
      children: [
        { id: "Role", label: "Role" },
        { id: "User", label: "User" },
      ],
    },
    {
      id: "Project",
      label: "Project",
      // children: [
      //   { id: "pickers-community", label: "@mui/x-date-pickers" },
      //   { id: "pickers-pro", label: "@mui/x-date-pickers-pro" },
      // ],
    },
    {
      id: "Application",
      label: "Application",
      // children: [{ id: "charts-community", label: "@mui/x-charts" }],
    },
    {
      id: "Dynamic Links",
      label: "Dynamic Links",
      // children: [{ id: "tree-view-community", label: "@mui/x-tree-view" }],
    },
  ];
  function getItemDescendantsIds(item) {
    const ids = [];
    item.children?.forEach((child) => {
      ids.push(child.id);
      ids.push(...getItemDescendantsIds(child));
    });

    return ids;
  }
  const [selectedItems, setSelectedItems] = React.useState([]);
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
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "1px solid #000",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };
  const columns = useMemo(() => tableColumns, []);
  const data = useMemo(() => tableData, []);

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

  // useEffect(() => {
  //   const handleBeforeUnload = (e) => {
  //     const customMessage =
  //       "You have unsaved changes. Are you sure you want to leave this page?";
  //     e.preventDefault();
  //     e.returnValue = customMessage;
  //     return customMessage;
  //   };
  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   return () => {
  //     console.log("Start Again");
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, []);

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
                {/* <Grid
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
                </Grid> */}
              </Grid>
              <Box sx={{ width: "100%", overflowX: "auto", display: "block" }}>
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
                                  <Button
                                    className="mui-icon-button"
                                    variant="outlined"
                                    startIcon={<BorderColorOutlinedIcon />}
                                  />
                                </Tooltip>
                                <Tooltip title="Delete" placement="top" arrow>
                                  <Button
                                    className="mui-icon-button"
                                    variant="outlined"
                                    startIcon={<DeleteForeverOutlinedIcon />}
                                  />
                                </Tooltip>
                              </Stack>
                            </StyledTableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length + 1} align="center">
                          No Data
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
            <Paper elevation={3}>
              <Box sx={{ borderBottom: "1px solid #9e9e9e" }}>
                <Grid
                  container
                  spacing={2.5}
                  mt={1}
                  className="pl-20 pr-20 pb-20"
                >
                  <Grid item xs={4}>
                    <FormControl variant="standard" fullWidth>
                      <Typography className="label d-flex items-center">
                        Name
                        <sup className="asc">*</sup>
                      </Typography>
                      <BootstrapInput
                        fullWidth
                        id="name"
                        size="small"
                        label="Name"
                        name="name"
                        placeholder="Name"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    {/* <FormControl variant="standard" fullWidth>
                      <Typography className="label d-flex items-center">
                        Description
                        <sup className="asc">*</sup>
                      </Typography>
                      <BootstrapInput
                        fullWidth
                        id="description"
                        size="small"
                        label="Description"
                        name="description"
                        placeholder="Description"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </FormControl> */}
                  </Grid>
                  <Grid item xs={4}></Grid>
                  <Grid item xs={4}>
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
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
              <Box className="p-20">
                <Grid container spacing={3}>
                  <Grid item xs={9}></Grid>
                  <Grid item xs={1}>
                    <Button
                      fullWidth
                      variant="outlined"
                      sx={{ backgroundColor: "primary.main" }}
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ backgroundColor: "primary.main" }}
                      onClick={handleClose}
                    >
                      Save
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default Role;

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
