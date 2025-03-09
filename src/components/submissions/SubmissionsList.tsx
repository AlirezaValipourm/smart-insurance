'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Toolbar,
  Typography,
  TextField,
  IconButton,
  Tooltip,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Popover,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  ViewColumn as ViewColumnIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { RootState } from '../../store';
import {
  setCurrentPage,
  setItemsPerPage,
  setSearchTerm,
  setSort,
  toggleColumnVisibility,
} from '../../store/slices/submissionsSlice';
import { useSubmissionsData } from '../../hooks/useSubmissionsData';

// Define the submission type
interface Submission {
  id: string;
  [key: string]: string | number;
}

/**
 * Submissions list component that displays a table of form submissions
 * @returns The submissions list component
 */
export function SubmissionsList() {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  
  // Get submissions data from Redux and React Query
  const {
    visibleColumns,
    columns,
    sortBy,
    sortDirection,
    searchTerm,
    currentPage,
    itemsPerPage,
  } = useSelector((state: RootState) => state.submissions);
  
  const { submissions, isLoading, error, refetch, totalItems } = useSubmissionsData();
  
  // Handle column visibility toggle
  const handleColumnVisibilityClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleColumnVisibilityClose = () => {
    setAnchorEl(null);
  };
  
  // Handle column toggle
  const handleColumnToggle = (column: string) => {
    dispatch(toggleColumnVisibility(column));
  };
  
  // Handle sort
  const handleSort = (column: string) => {
    const isAsc = sortBy === column && sortDirection === 'asc';
    dispatch(setSort({ sortBy: column, sortDirection: isAsc ? 'desc' : 'asc' }));
  };
  
  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(event.target.value));
  };
  
  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    dispatch(setCurrentPage(newPage + 1));
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setItemsPerPage(parseInt(event.target.value, 10)));
  };
  
  // Handle refresh
  const handleRefresh = () => {
    refetch();
  };
  
  const open = Boolean(anchorEl);
  
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error">
        Error loading submissions: {error instanceof Error ? error.message : 'Unknown error'}
      </Alert>
    );
  }
  
  return (
    <Paper elevation={3} sx={{ width: '100%', mb: 2 }}>
      <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Insurance Applications
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            variant="outlined"
            placeholder="Search..."
            size="small"
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1 }} />,
            }}
            sx={{ mr: 2 }}
          />
          
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Select columns">
            <IconButton onClick={handleColumnVisibilityClick}>
              <ViewColumnIcon />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleColumnVisibilityClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <Box sx={{ p: 2, maxHeight: 300, overflow: 'auto' }}>
            <Typography variant="subtitle1" gutterBottom>
              Show/Hide Columns
            </Typography>
            <FormGroup>
              {columns.map((column) => (
                <FormControlLabel
                  key={column}
                  control={
                    <Checkbox
                      checked={visibleColumns.includes(column)}
                      onChange={() => handleColumnToggle(column)}
                    />
                  }
                  label={column}
                />
              ))}
            </FormGroup>
          </Box>
        </Popover>
      </Toolbar>
      
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
          <TableHead>
            <TableRow>
              {visibleColumns.map((column) => (
                <TableCell
                  key={column}
                  sortDirection={sortBy === column ? sortDirection : false}
                >
                  <TableSortLabel
                    active={sortBy === column}
                    direction={sortBy === column ? sortDirection : 'asc'}
                    onClick={() => handleSort(column)}
                  >
                    {column}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length} align="center">
                  No submissions found
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((submission) => (
                <TableRow
                  hover
                  key={submission.id}
                >
                  {visibleColumns.map((column) => (
                    <TableCell key={`${submission.id}-${column}`}>
                      {submission[column]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalItems}
        rowsPerPage={itemsPerPage}
        page={currentPage - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
} 