'use client';
import { useEffect, useState } from 'react';
import {
  Box, Typography, Container, Grid, Button, TextField, Radio, Checkbox, Switch,
  Select, MenuItem, Slider, CircularProgress, LinearProgress, Accordion, AccordionSummary,
  AccordionDetails, Card, CardContent, CardActions, CardHeader, CardMedia,
  Alert, AlertTitle, Chip, Avatar, Badge, Rating,
  BottomNavigation, BottomNavigationAction, Breadcrumbs, Link, Divider, Fab,
  List, ListItem, ListItemText, ListItemIcon, ListItemButton, ListItemAvatar,
  ListSubheader, Paper, Snackbar, Tab, Tabs, Dialog, DialogTitle,
  DialogContent, DialogActions, DialogContentText, IconButton, Tooltip,
  SpeedDial, SpeedDialAction, SpeedDialIcon, Stepper, Step, StepLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  FormGroup, FormControlLabel, FormControl, FormLabel, FormHelperText,
  InputLabel, InputAdornment, OutlinedInput, Pagination, Skeleton,
  ToggleButton, ToggleButtonGroup, ButtonGroup, Stack, Menu,
  Fade, Grow, Slide, Collapse,
  Grid2,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  ExpandMore as ExpandMoreIcon,
  Home as HomeIcon,
  Favorite as FavoriteIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Mail as MailIcon,
  Save as SaveIcon,
  Print as PrintIcon,
  FileCopy as FileCopyIcon,
  Search as SearchIcon,
  Navigation as NavigationIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  ViewQuilt as ViewQuiltIcon,
} from '@mui/icons-material';
import useSettings from '@/smart-insurance/hooks/useSettings';

export default function DesignSystem() {
  const { onToggleMode, onChangeDirection, onChangeColor, onChangeLayout, onToggleStretch, onResetSetting, themeDirection } = useSettings();
  // State management
  const [tabValue, setTabValue] = useState(0);
  const [bottomNavValue, setBottomNavValue] = useState(0);
  const [selectValue, setSelectValue] = useState(10);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [alignment, setAlignment] = useState<string | null>('left');
  const [expanded, setExpanded] = useState<string | false>(false);
  const [rating, setRating] = useState<number | null>(2.5);
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" gutterBottom>Design System</Typography>

      {/* Settings Controls */}
      <Section title="Settings Controls">
        <Stack spacing={4}>
          {/* Theme Mode */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Theme Mode</Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={onToggleMode}
              >
                Toggle Light/Dark Mode
              </Button>
            </Stack>
          </Stack>

          {/* Theme Direction */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Theme Direction</Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color={themeDirection === 'ltr' ? 'primary' : 'inherit'}
                onClick={() => {
                  const event = {
                    target: { value: 'ltr' }
                  } as React.ChangeEvent<HTMLInputElement>;
                  onChangeDirection(event);
                }}
              >
                LTR
              </Button>
              <Button
                variant="contained"
                color={themeDirection === 'rtl' ? 'primary' : 'inherit'}
                onClick={() => {
                  const event = {
                    target: { value: 'rtl' }
                  } as React.ChangeEvent<HTMLInputElement>;
                  onChangeDirection(event);
                }}
              >
                RTL
              </Button>
            </Stack>
          </Stack>

          {/* Color Presets */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Color Presets</Typography>
            <Stack direction="row" spacing={2}>
              {['default', 'purple', 'cyan', 'blue', 'orange', 'red'].map((color) => (
                <Button
                  key={color}
                  variant="contained"
                  onClick={(e) => onChangeColor(e as any)}
                  value={color}
                  sx={{
                    bgcolor: color === 'default' ? 'primary.main' : `${color}.main`,
                    '&:hover': {
                      bgcolor: color === 'default' ? 'primary.dark' : `${color}.dark`,
                    }
                  }}
                >
                  {color}
                </Button>
              ))}
            </Stack>
          </Stack>

          {/* Layout */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Layout</Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={(e) => onChangeLayout(e as any)}
                value="vertical"
              >
                Vertical
              </Button>
              <Button
                variant="contained"
                onClick={(e) => onChangeLayout(e as any)}
                value="horizontal"
              >
                Horizontal
              </Button>
            </Stack>
          </Stack>

          {/* Stretch */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Stretch</Typography>
            <Button
              variant="contained"
              onClick={onToggleStretch}
            >
              Toggle Stretch
            </Button>
          </Stack>

          {/* Reset */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Reset Settings</Typography>
            <Button
              variant="contained"
              color="error"
              onClick={onResetSetting}
            >
              Reset All Settings
            </Button>
          </Stack>
        </Stack>
      </Section>

      {/* Typography */}
      <Section title="Typography">
        <Stack spacing={2}>
          <Typography variant="h1">h1. Heading</Typography>
          <Typography variant="h2">h2. Heading</Typography>
          <Typography variant="h3">h3. Heading</Typography>
          <Typography variant="h4">h4. Heading</Typography>
          <Typography variant="h5">h5. Heading</Typography>
          <Typography variant="h6">h6. Heading</Typography>
          <Typography variant="subtitle1">subtitle1. Lorem ipsum dolor sit amet</Typography>
          <Typography variant="subtitle2">subtitle2. Lorem ipsum dolor sit amet</Typography>
          <Typography variant="body1">body1. Lorem ipsum dolor sit amet</Typography>
          <Typography variant="body2">body2. Lorem ipsum dolor sit amet</Typography>
          <Typography variant="button" display="block">BUTTON TEXT</Typography>
          <Typography variant="caption" display="block">caption text</Typography>
          <Typography variant="overline" display="block">OVERLINE TEXT</Typography>
        </Stack>
      </Section>

      {/* Buttons */}
      <Section title="Buttons">
        <Stack spacing={4}>
          {/* Regular Buttons */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Regular Buttons</Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="contained">Contained</Button>
              <Button variant="outlined">Outlined</Button>
              <Button variant="text">Text</Button>
              <Button disabled>Disabled</Button>
              <Button variant="contained" href="#" color="primary">Link</Button>
            </Stack>
          </Stack>

          {/* Button Colors */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Button Colors</Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" color="primary">Primary</Button>
              <Button variant="contained" color="secondary">Secondary</Button>
              <Button variant="contained" color="success">Success</Button>
              <Button variant="contained" color="error">Error</Button>
              <Button variant="contained" color="info">Info</Button>
              <Button variant="contained" color="warning">Warning</Button>
            </Stack>
          </Stack>

          {/* Button Sizes */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Button Sizes</Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button variant="contained" size="small">Small</Button>
              <Button variant="contained" size="medium">Medium</Button>
              <Button variant="contained" size="large">Large</Button>
            </Stack>
          </Stack>

          {/* Button Groups */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Button Groups</Typography>
            <ButtonGroup variant="contained">
              <Button>One</Button>
              <Button>Two</Button>
              <Button>Three</Button>
            </ButtonGroup>
            <ButtonGroup variant="outlined" orientation="vertical">
              <Button>One</Button>
              <Button>Two</Button>
              <Button>Three</Button>
            </ButtonGroup>
          </Stack>

          {/* FABs */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Floating Action Buttons</Typography>
            <Stack direction="row" spacing={2}>
              <Fab color="primary" aria-label="add">
                <AddIcon />
              </Fab>
              <Fab color="secondary" aria-label="edit">
                <EditIcon />
              </Fab>
              <Fab variant="extended">
                <NavigationIcon sx={{ mr: 1 }} />
                Navigate
              </Fab>
            </Stack>
          </Stack>

          {/* Icon Buttons */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Icon Buttons</Typography>
            <Stack direction="row" spacing={2}>
              <IconButton aria-label="delete">
                <DeleteIcon />
              </IconButton>
              <IconButton aria-label="delete" disabled color="primary">
                <DeleteIcon />
              </IconButton>
              <IconButton color="secondary" aria-label="add an alarm">
                <AddIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Stack>
      </Section>

      {/* Form Controls */}
      <Section title="Form Controls">
        <Stack spacing={4}>
          {/* Text Fields */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Text Fields</Typography>
            <Stack spacing={2}>
              <TextField label="Standard" variant="standard" />
              <TextField label="Outlined" variant="outlined" />
              <TextField label="Filled" variant="filled" />
              <TextField
                label="With Helper Text"
                helperText="Some important text"
                error
              />
              <TextField
                label="With Adornment"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
              <TextField
                label="Password"
                type="password"
                autoComplete="current-password"
              />
              <TextField
                label="Multiline"
                multiline
                rows={4}
              />
              <TextField size="small" label="Small" />
              <TextField fullWidth label="Full Width" />
              <TextField disabled label="Disabled" defaultValue="Disabled" />
              <TextField
                label="Read Only"
                defaultValue="Read Only"
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="With End Adornment"
                InputProps={{
                  endAdornment: <InputAdornment position="end"><SearchIcon /></InputAdornment>,
                }}
              />
              <TextField
                label="Dense"
                margin="dense"
              />
              <TextField
                select
                label="Select"
                defaultValue="EUR"
              >
                <MenuItem value="EUR">€ (EUR)</MenuItem>
                <MenuItem value="USD">$ (USD)</MenuItem>
              </TextField>
              <TextField
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </Stack>

          {/* Selection Controls */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Selection Controls</Typography>
            <FormControl component="fieldset">
              <FormLabel component="legend">Labels</FormLabel>
              <FormGroup>
                <FormControlLabel control={<Checkbox defaultChecked />} label="Checkbox" />
                <FormControlLabel control={<Radio />} label="Radio" />
                <FormControlLabel control={<Switch />} label="Switch" />
              </FormGroup>
              <FormHelperText>Helper text</FormHelperText>
            </FormControl>
          </Stack>

          {/* Select */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Select</Typography>
            <FormControl fullWidth>
              <InputLabel>Age</InputLabel>
              <Select
                value={selectValue}
                label="Age"
                onChange={(e) => setSelectValue(e.target.value as number)}
              >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small">
              <InputLabel>Small</InputLabel>
              <Select value={selectValue} label="Small">
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
              </Select>
            </FormControl>
            <FormControl disabled>
              <InputLabel>Disabled</InputLabel>
              <Select value={selectValue} label="Disabled">
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
              </Select>
            </FormControl>
            <FormControl variant="standard">
              <InputLabel>Standard</InputLabel>
              <Select value={selectValue}>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          {/* Rating */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Rating</Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
              precision={0.5}
            />
            <Rating
              defaultValue={2}
              size="large"
              icon={<FavoriteIcon fontSize="inherit" />}
              emptyIcon={<FavoriteIcon fontSize="inherit" />}
            />
          </Stack>

          {/* Slider */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Slider</Typography>
            <Slider defaultValue={30} />
            <Slider
              defaultValue={[20, 37]}
              valueLabelDisplay="auto"
            />
            <Slider
              marks
              step={10}
              min={0}
              max={100}
              valueLabelDisplay="auto"
            />
            <Slider
              orientation="vertical"
              defaultValue={30}
              sx={{ height: 200 }}
            />
            <Slider
              disabled
              defaultValue={30}
            />
            <Slider
              size="small"
              defaultValue={30}
            />
          </Stack>

          {/* Toggle Buttons */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Toggle Buttons</Typography>
            <ToggleButtonGroup
              value={alignment}
              exclusive
              onChange={(event, newAlignment) => setAlignment(newAlignment)}
            >
              <ToggleButton value="left">Left</ToggleButton>
              <ToggleButton value="center">Center</ToggleButton>
              <ToggleButton value="right">Right</ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup size="small" color="primary" orientation="vertical">
              <ToggleButton value="list"><ViewListIcon /></ToggleButton>
              <ToggleButton value="module"><ViewModuleIcon /></ToggleButton>
              <ToggleButton value="quilt"><ViewQuiltIcon /></ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Stack>
      </Section>

      {/* Data Display */}
      <Section title="Data Display">
        <Stack spacing={4}>
          {/* Cards */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Cards</Typography>
            <Grid2 container spacing={2}>
              <Grid2 size={{
                xs: 12,
                md: 4
              }}>
                <Card>
                  <CardHeader
                    avatar={<Avatar>R</Avatar>}
                    action={
                      <IconButton aria-label="settings">
                        <SettingsIcon />
                      </IconButton>
                    }
                    title="Card Title"
                    subheader="September 14, 2023"
                  />
                  <CardMedia
                    component="img"
                    height="194"
                    image="https://source.unsplash.com/random/400x200"
                    alt="Random image"
                  />
                  <CardContent>
                    <Typography variant="body2">
                      This is a media card. You can use this section to describe the content.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Share</Button>
                    <Button size="small">Learn More</Button>
                  </CardActions>
                </Card>
              </Grid2>
            </Grid2>
          </Stack>

          {/* Lists */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Lists</Typography>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              <ListSubheader>Settings</ListSubheader>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" secondary="Personal information" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" secondary="Privacy and security" />
              </ListItem>
              <Divider />
              <ListItem component="button" >
                <ListItemAvatar>
                  <Avatar>
                    <MailIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Messages" secondary="View your messages" />
              </ListItem>
            </List>
          </Stack>

          {/* Table */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Table</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Dessert</TableCell>
                    <TableCell align="right">Calories</TableCell>
                    <TableCell align="right">Fat&nbsp;(g)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Frozen yoghurt
                    </TableCell>
                    <TableCell align="right">159</TableCell>
                    <TableCell align="right">6.0</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Ice cream sandwich
                    </TableCell>
                    <TableCell align="right">237</TableCell>
                    <TableCell align="right">9.0</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </Stack>
      </Section>

      {/* Feedback */}
      <Section title="Feedback">
        <Stack spacing={4}>
          {/* Alerts */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Alerts</Typography>
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              This is an error alert — check it out!
            </Alert>
            <Alert severity="warning">
              <AlertTitle>Warning</AlertTitle>
              This is a warning alert — check it out!
            </Alert>
            <Alert severity="info">
              <AlertTitle>Info</AlertTitle>
              This is an info alert — check it out!
            </Alert>
            <Alert severity="success">
              <AlertTitle>Success</AlertTitle>
              This is a success alert — check it out!
            </Alert>
            <Alert variant="outlined" severity="error">
              This is an outlined error alert
            </Alert>
            <Alert variant="filled" severity="warning">
              This is a filled warning alert
            </Alert>
            <Alert
              action={
                <Button color="inherit" size="small">
                  UNDO
                </Button>
              }
            >
              This is an alert with an action
            </Alert>
          </Stack>

          {/* Progress */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Progress</Typography>
            <CircularProgress />
            <CircularProgress color="secondary" />
            <LinearProgress />
            <LinearProgress color="secondary" />
            <CircularProgress variant="determinate" value={75} />
            <LinearProgress variant="determinate" value={75} />
            <LinearProgress variant="buffer" value={75} valueBuffer={85} />
            <CircularProgress size={60} />
          </Stack>

          {/* Skeleton */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Skeleton</Typography>
            <Skeleton variant="text" />
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="rectangular" width={210} height={118} />
          </Stack>
        </Stack>
      </Section>

      {/* Navigation */}
      <Section title="Navigation">
        <Stack spacing={4}>
          {/* Tabs */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Tabs</Typography>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab label="Item One" />
              <Tab label="Item Two" />
              <Tab label="Item Three" />
            </Tabs>
          </Stack>

          {/* Breadcrumbs */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Breadcrumbs</Typography>
            <Breadcrumbs>
              <Link href="#" underline="hover">Home</Link>
              <Link href="#" underline="hover">Catalog</Link>
              <Typography color="text.primary">Current Page</Typography>
            </Breadcrumbs>
          </Stack>

          {/* Bottom Navigation */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Bottom Navigation</Typography>
            <BottomNavigation
              value={bottomNavValue}
              onChange={(e, newValue) => setBottomNavValue(newValue)}
            >
              <BottomNavigationAction label="Home" icon={<HomeIcon />} />
              <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
              <BottomNavigationAction label="Profile" icon={<PersonIcon />} />
            </BottomNavigation>
          </Stack>

          {/* Pagination */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Pagination</Typography>
            <Pagination count={10} color="primary" />
            <Pagination count={10} color="secondary" variant="outlined" />
          </Stack>

          {/* Stepper */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Stepper</Typography>
            <Stepper activeStep={activeStep}>
              <Step>
                <StepLabel>Step 1</StepLabel>
              </Step>
              <Step>
                <StepLabel>Step 2</StepLabel>
              </Step>
              <Step>
                <StepLabel>Step 3</StepLabel>
              </Step>
            </Stepper>
            <Stepper activeStep={activeStep} orientation="vertical">
              <Step>
                <StepLabel>Step 1</StepLabel>
              </Step>
              <Step>
                <StepLabel>Step 2</StepLabel>
              </Step>
            </Stepper>
            <Stepper activeStep={activeStep} alternativeLabel>
              <Step>
                <StepLabel>Step 1</StepLabel>
              </Step>
              <Step>
                <StepLabel>Step 2</StepLabel>
              </Step>
            </Stepper>
          </Stack>
        </Stack>
      </Section>

      {/* Surfaces */}
      <Section title="Surfaces">
        <Stack spacing={4}>
          {/* Paper */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Paper</Typography>
            <Grid2 container spacing={2}>
              <Grid2 size={{
                xs:12,
                md:4
              }}>
                <Paper elevation={0} sx={{ p: 2 }}>Elevation 0</Paper>
              </Grid2>
              <Grid2 size={{
                xs:12,
                md:4
              }}>
                <Paper elevation={1} sx={{ p: 2 }}>Elevation 1</Paper>
              </Grid2>
              <Grid2 size={{
                xs:12,
                md:4
              }}>
                <Paper elevation={3} sx={{ p: 2 }}>Elevation 3</Paper>
              </Grid2>
            </Grid2>
          </Stack>

          {/* Accordion */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Accordion</Typography>
            <Accordion expanded={expanded === 'panel1'} onChange={() => setExpanded(expanded === 'panel1' ? false : 'panel1')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Expansion Panel 1</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel2'} onChange={() => setExpanded(expanded === 'panel2' ? false : 'panel2')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Expansion Panel 2</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </Stack>
      </Section>

      {/* Utils */}
      <Section title="Utils">
        <Stack spacing={4}>
          {/* Modal */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Modal</Typography>
            <Button variant="outlined" onClick={() => setDialogOpen(true)}>
              Open Dialog
            </Button>
            <Dialog
              open={dialogOpen}
              onClose={() => setDialogOpen(false)}
            >
              <DialogTitle>Dialog Title</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Dialog content goes here. You can add any content you want.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setDialogOpen(false)} autoFocus>
                  Agree
                </Button>
              </DialogActions>
            </Dialog>
          </Stack>

          {/* Tooltip */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Tooltip</Typography>
            <Tooltip title="Delete">
              <IconButton>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Badge */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Badge</Typography>
            <Badge badgeContent={4} color="primary">
              <MailIcon />
            </Badge>
            <Badge badgeContent={4} color="secondary">
              <MailIcon />
            </Badge>
          </Stack>

          {/* Chip */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Chip</Typography>
            <Stack direction="row" spacing={1}>
              <Chip label="Basic" />
              <Chip label="Disabled" disabled />
              <Chip label="Clickable" onClick={() => { }} />
              <Chip label="Deletable" onDelete={() => { }} />
              <Chip
                avatar={<Avatar>M</Avatar>}
                label="With Avatar"
              />
            </Stack>
          </Stack>

          {/* Divider */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Divider</Typography>
            <Divider />
            <Divider>CENTER</Divider>
            <Divider textAlign="left">LEFT</Divider>
            <Divider textAlign="right">RIGHT</Divider>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: '100%' }}>
                <Typography>Side</Typography>
              </Box>
              <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
              <Box sx={{ width: '100%' }}>
                <Typography>Side</Typography>
              </Box>
            </Box>
          </Stack>

          {/* Transitions */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Transitions</Typography>
            <Button onClick={() => setOpen(!open)}>Show Transition</Button>
            <Fade in={open}>
              <Paper sx={{ m: 1 }}>
                <Typography>Fade</Typography>
              </Paper>
            </Fade>
            <Grow in={open}>
              <Paper sx={{ m: 1 }}>
                <Typography>Grow</Typography>
              </Paper>
            </Grow>
            <Slide direction="up" in={open}>
              <Paper sx={{ m: 1 }}>
                <Typography>Slide</Typography>
              </Paper>
            </Slide>
            <Collapse in={open}>
              <Paper sx={{ m: 1 }}>
                <Typography>Collapse</Typography>
              </Paper>
            </Collapse>
          </Stack>

          {/* Menu */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Menu</Typography>
            <Button onClick={(event) => setMenuAnchorEl(event.currentTarget)}>
              Open Menu
            </Button>
            <Menu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={() => setMenuAnchorEl(null)}
            >
              <MenuItem onClick={() => setMenuAnchorEl(null)}>Profile</MenuItem>
              <MenuItem onClick={() => setMenuAnchorEl(null)}>My account</MenuItem>
              <Divider />
              <MenuItem onClick={() => setMenuAnchorEl(null)}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>
            </Menu>
          </Stack>

          {/* Toggle Buttons */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Toggle Buttons</Typography>
            <ToggleButtonGroup
              color="primary"
              value={alignment}
              exclusive
              onChange={(event, newAlignment) => setAlignment(newAlignment)}
            >
              <ToggleButton value="left">Left</ToggleButton>
              <ToggleButton value="center">Center</ToggleButton>
              <ToggleButton value="right">Right</ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup
              orientation="vertical"
              value={alignment}
              exclusive
            >
              <ToggleButton value="top">Top</ToggleButton>
              <ToggleButton value="middle">Middle</ToggleButton>
              <ToggleButton value="bottom">Bottom</ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup
              size="small"
              disabled
            >
              <ToggleButton value="1">1</ToggleButton>
              <ToggleButton value="2">2</ToggleButton>
            </ToggleButtonGroup>
          </Stack>

          {/* Stepper */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">Stepper</Typography>
            <Stepper activeStep={activeStep} orientation="vertical">
              <Step>
                <StepLabel>Select campaign settings</StepLabel>
              </Step>
              <Step>
                <StepLabel>Create an ad group</StepLabel>
              </Step>
            </Stepper>
            <Stepper activeStep={activeStep} alternativeLabel>
              <Step>
                <StepLabel>Select campaign settings</StepLabel>
              </Step>
              <Step>
                <StepLabel>Create an ad group</StepLabel>
              </Step>
            </Stepper>
          </Stack>

          {/* SpeedDial */}
          <Stack spacing={2}>
            <Typography variant="subtitle1">SpeedDial</Typography>
            <Box sx={{ height: 320, position: 'relative' }}>
              <SpeedDial
                ariaLabel="SpeedDial example"
                sx={{ position: 'absolute', bottom: 16, right: 16 }}
                icon={<SpeedDialIcon />}
              >
                {[
                  { icon: <FileCopyIcon />, name: 'Copy' },
                  { icon: <SaveIcon />, name: 'Save' },
                  { icon: <PrintIcon />, name: 'Print' },
                  { icon: <ShareIcon />, name: 'Share' },
                ].map((action) => (
                  <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                  />
                ))}
              </SpeedDial>
            </Box>
          </Stack>
        </Stack>
      </Section>
    </Container>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>{title}</Typography>
      {children}
      <Divider sx={{ mt: 3 }} />
    </Box>
  );
}