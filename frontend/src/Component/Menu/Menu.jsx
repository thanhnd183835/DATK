import React, {useState} from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from '@material-ui/icons/Menu';
import Typography from "@material-ui/core/Typography";
import {useHistory} from 'react-router-dom';
import Drawer from "@material-ui/core/Drawer";
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import AddShoppingCart from '@material-ui/icons/AddShoppingCart';
import SummarizeIcon from '@mui/icons-material/Summarize';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ListItemText from "@material-ui/core/ListItemText";
import makeStyles from "@material-ui/core/styles/makeStyles";
import clsx from 'clsx';
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import {useSelector} from "react-redux";
import grey from "@material-ui/core/colors/grey";


 const drawerWidth = 280;


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    appBarSpacer: theme.mixins.toolbar,
    title: {
        color: 'red',
        fontSize: '17px',
        textTransform: "uppercase",
        marginLeft: '10px',
        marginTop: '20px'
    },
    avatar: {
        cursor: 'pointer',
        backgroundColor: theme.palette.type === 'light' ? grey[200] : grey[900],
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
}))


const Menu = (props) => {
    const {changeOpenMenu} = props;
    const classes = useStyles();
    const history = useHistory();
    const inForUser = useSelector((state => state?.auth?.user?.data?.data))
    const [open, setOpen] = React.useState(true);


    const handleDrawerOpen = () => {
        setOpen(true);
        changeOpenMenu(true);
    }
    const handleDrawerClose = () => {
        setOpen(false)
        changeOpenMenu(false);
    }
    const logOut = () => {
        localStorage.removeItem('persist: root');
        localStorage.removeItem('token');
        history.push('/login')
    }
    return (
        <div className={`${classes.root} root-menu root-menu-${open}`}>
            <CssBaseline/>
            <AppBar position="absolute"  className={clsx(classes.appBar, open && classes.appBarShift)}>
                <Toolbar className={classes.toolBar}>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography
                        component="h1"
                        variant="h6"
                        color="inherit"
                        noWrap
                        onClick={() => history.push('/')}
                    >
                        Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                open={open}
                classes={{
                    paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
                }}
            >
                <div className={classes.toolbarIcon}>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon/>
                    </IconButton>
                </div>
                <Box
                    className={classes.avatar}
                    borderRadius={16}
                    p={2}
                    width={260}
                    display={'flex'}
                    alignItems={'center'}
                >
                    <Box>
                        <Avatar src={
                            'https://res.cloudinary.com/minimal-ui/image/upload/v1614655910/upload_minimal/avatar/minimal_avatar.jpg'
                        }/>
                    </Box>
                    <Box ml={2}>
                        <Typography variant="subtitle2">
                            {inForUser?.userName}
                        </Typography>
                    </Box>
                </Box>
                <div className={classes.title}>
                    Quản Lý chung
                </div>
                <List>
                    <div>
                        <ListItem
                            button
                            onClick={() => {
                                history.push('/order')
                            }}
                        >
                            <ListItemIcon>
                                <AddShoppingCart color="primary"/>
                            </ListItemIcon>
                            <ListItemText primary="Thanh toán đơn hàng"/>
                        </ListItem>
                        <ListItem
                            button
                            onClick={() => {
                                history.push('/listTransaction')
                            }}
                        >
                            <ListItemIcon>
                                <SummarizeIcon color="success"/>
                            </ListItemIcon>
                            <ListItemText primary="Danh sách đơn hàng "/>
                        </ListItem>
                        <ListItem
                            button
                            onClick={() => {
                                logOut();
                            }}
                        >
                            <ListItemIcon>
                                <ExitToAppIcon color="error"/>
                            </ListItemIcon>
                            <ListItemText primary="Đăng xuất"/>
                        </ListItem>
                    </div>
                </List>
            </Drawer>
        </div>
    )
}
export default Menu;