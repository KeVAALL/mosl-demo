import PropTypes from "prop-types";
import { forwardRef, useEffect, useRef, useState } from "react";

// material-ui
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  Grid,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Pagination,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Pagination as MuiPagination,
  InputAdornment,
  IconButton,
} from "@mui/material";
import NorthOutlinedIcon from "@mui/icons-material/NorthOutlined";
import SouthOutlinedIcon from "@mui/icons-material/SouthOutlined";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

// third-party
import { CSVLink } from "react-csv";
import { BootstrapInput } from "../Input/textfield";
// import { matchSorter } from "match-sorter";

// assets
export function GlobalFilter({ globalFilter, setGlobalFilter, ...props }) {
  return (
    // <FormControl variant="standard" fullWidth>
    //   <InputLabel
    //     shrink
    //     htmlFor="global"
    //     className="input-label"
    //     sx={{ display: "flex", alignItems: "center" }}
    //   >
    //     <Typography variant="body1" className="input-label">
    //       Search Records
    //     </Typography>
    //     <span style={{ color: "red", marginLeft: "0.25rem" }}>*</span>
    //   </InputLabel>
    <BootstrapInput
      value={globalFilter || ""}
      onChange={(e) => setGlobalFilter(e.target.value || undefined)}
      placeholder="Search"
      id="global"
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            edge="end"
            color="text.greyLight"
          >
            <SearchOutlinedIcon fontSize="small" color="text.greyLight" />
          </IconButton>
        </InputAdornment>
      }
      {...props}
    />
    // </FormControl>
  );
}

GlobalFilter.propTypes = {
  preGlobalFilteredRows: PropTypes.array,
  globalFilter: PropTypes.string,
  setGlobalFilter: PropTypes.func,
};

// ==============================|| SORT HEADER ||============================== //

export const HeaderSort = ({ column }) => {
  const theme = useTheme();

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Box sx={{ width: "max-content" }}>{column.render("Header")}</Box>
      {!column.disableSortBy && (
        <Stack
          direction="row"
          alignItems="center"
          {...column.getHeaderProps(column.getSortByToggleProps())}
        >
          <NorthOutlinedIcon
            style={{
              color:
                column.isSorted && !column.isSortedDesc
                  ? "inherit"
                  : "darkgrey",
              fontSize: "1rem",
              // color: column.isSorted && !column.isSortedDesc ? 'black' : 'black'
            }}
          />
          <SouthOutlinedIcon
            style={{
              color: column.isSortedDesc ? "inherit" : "darkgrey",
              fontSize: "1rem",
              // color: column.isSortedDesc ? 'black' : 'black'
            }}
          />
        </Stack>
      )}
    </Stack>
  );
};

HeaderSort.propTypes = {
  column: PropTypes.any,
  sort: PropTypes.bool,
};

export const TablePagination = ({
  gotoPage,
  rows,
  setPageSize,
  pageSize,
  pageIndex,
  viewOptions = [5, 10],
}) => {
  const [open, setOpen] = useState(false);

  const handleChangePagination = (event, value) => {
    gotoPage(value - 1);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{ alignItems: "center", justifyContent: "space-between" }}
    >
      <Grid item>
        <Stack
          direction="row"
          alignItems="center"
          sx={{ gap: { md: "16px", xs: "11px" } }}
        >
          <Typography variant="caption" color="text.primary">
            Rows per page
          </Typography>
          <FormControl size="small">
            <Select
              open={open}
              onClose={() => setOpen(false)}
              onOpen={() => setOpen(true)}
              value={pageSize}
              onChange={handlePageSizeChange}
              sx={{ fontSize: "14px" }}
            >
              {viewOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="caption" color="text.primary">
            Go to page
          </Typography>
          <TextField
            size="small"
            type="number"
            value={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) : 0;
              gotoPage(page - 1);
            }}
            inputProps={{
              min: 1,
              style: { padding: "0.5rem", fontSize: "14px" },
            }}
            sx={{ width: 50, fontSize: "13px" }}
          />
        </Stack>
      </Grid>
      <Grid item>
        <MuiPagination
          count={Math.ceil(rows.length / pageSize)}
          page={pageIndex + 1}
          onChange={handleChangePagination}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Grid>
    </Grid>
  );
};

TablePagination.propTypes = {
  gotoPage: PropTypes.func,
  setPageSize: PropTypes.func,
  pageIndex: PropTypes.number,
  pageSize: PropTypes.number,
  initialPageSize: PropTypes.number,
  rows: PropTypes.array,
  viewOptions: PropTypes.any,
};

// ==============================|| COLUMN HIDING - SELECT ||============================== //

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 200,
    },
  },
};
export const HidingSelect = ({
  hiddenColumns,
  setHiddenColumns,
  allColumns,
}) => {
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    setHiddenColumns(typeof value === "string" ? value.split(",") : value);
  };

  let visible = allColumns.filter((c) => !hiddenColumns.includes(c.id)).length;

  return (
    <FormControl sx={{ width: "100%" }}>
      <Select
        id="column-hiding"
        className="column-hiding"
        multiple
        displayEmpty
        value={hiddenColumns}
        onChange={handleChange}
        input={
          <BootstrapInput
            sx={{ borderRadius: 0.6 }}
            id="select-column-hiding"
            placeholder="select column"
          />
        }
        renderValue={(selected) => {
          if (selected.length === 0) {
            return (
              <Typography variant="subtitle1">All columns visible</Typography>
            );
          }

          if (selected.length > 0 && selected.length === allColumns.length) {
            return (
              <Typography variant="subtitle1">All columns visible</Typography>
            );
          }

          return (
            <Typography variant="subtitle1">
              {visible} column(s) visible
            </Typography>
          );
        }}
        MenuProps={MenuProps}
        size="small"
      >
        {allColumns.map((column) => {
          let ToggleChecked =
            column.id === "#"
              ? true
              : hiddenColumns.indexOf(column.id) > -1
              ? false
              : true;
          return (
            <MenuItem
              key={column.id}
              value={column.id}
              sx={{ "&.Mui-selected": { bgcolor: "background.paper" } }}
            >
              <Checkbox checked={ToggleChecked} color="primary" />
              <ListItemText
                primary={
                  typeof column.Header === "string"
                    ? column.Header
                    : column?.title
                }
              />
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

HidingSelect.propTypes = {
  setHiddenColumns: PropTypes.func,
  hiddenColumns: PropTypes.array,
  allColumns: PropTypes.array,
};

// ==============================|| CSV EXPORT ||============================== //

export const CSVExport = ({ data, filename, headers }) => {
  return (
    <Box>
      <CSVLink data={data} filename={filename} headers={headers}>
        <Tooltip title="CSV Export">
          <CloudDownloadOutlinedIcon
            size={38}
            style={{
              color: "gray",
              marginTop: 6,
              padding: 6,
              border: "1px solid #BEC8D0",
              borderRadius: 5,
            }}
          />
        </Tooltip>
      </CSVLink>
    </Box>
  );
};

CSVExport.propTypes = {
  data: PropTypes.array,
  headers: PropTypes.any,
  filename: PropTypes.string,
};
