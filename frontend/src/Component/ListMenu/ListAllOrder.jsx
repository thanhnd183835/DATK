import React, {useEffect, useState} from 'react';
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {BASE_URL} from "../ultils/constants";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import TablePagination from "@material-ui/core/TablePagination";
import Input from "@material-ui/core/Input";
import SearchIcon from "@material-ui/icons/Search";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import './listAllOrder.css';
import Menu from "../Menu/Menu";
import IconButton from "@material-ui/core/IconButton";
import {deleteTransaction} from "../Redux/transaction/transaction.slice";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Box from "@material-ui/core/Box";
import visuallyHidden from "@mui/utils/visuallyHidden";
import PropTypes from 'prop-types';


const colums = [
    {id: 'id', label: 'ID', align: 'center'},
    {id: 'orderId', label: 'Mã đơn hàng', align: 'center'},
    {id: 'orderType', label: 'Mã hàng hóa', align: 'center'},
    {id: 'amount', label: 'Số tiền', align: 'center'},
    {id: 'bankCode', label: 'Ngân Hàng', align: 'center'},
    {id: 'orderInfo', label: 'Nội dung', align: 'center'},
    {id: 'status', label: 'Trạng thái', align: 'center'},
    {id: 'action', label: 'Thao Tác', align: 'center'}
];

const useStyles = makeStyles({
    container: {
        maxHeight: 440,
    },
    textTitle: {
        marginLeft: '10px',
        color: '#0926d7',
        fontSize: '30px',
        textTransform: 'uppercase',
    },
    header: {
        marginTop: 80,
        display: 'flex',
        marginBottom: '20px',
        justifyContent: 'space-between',
    },
    inputSearch: {
        width: '40%',
        height: '80%',
        marginTop: '20px',
        marginLeft: '50%'
    },
    iconSearch: {
        marginTop: '20px',
    },
    search: {
        width: '45%',
        display: 'flex'
    },
    input: {
        width: '90%'
    }
})

function createData(transaction) {
    return {
        id: transaction._id,
        amount: transaction.amount,
        bankCode: transaction.bankCode,
        orderInfo: transaction.orderInfo,
        orderType: transaction.orderType,
        orderId: transaction.orderId,
        status: transaction.status === 1 ? 'Thành Công' : transaction.status === 0 ? 'Chưa Thanh Toán' : 'Thất Bại',
    };
};

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
};

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
};

function EnhancedTableHead(props) {
    const {order, orderBy, onRequestSort} =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {colums.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={"center"}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                            style={{color: '#0926d7', textTransform: 'uppercase', fontSize: 15, marginLeft: 25}}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};


export default function ListAllOrder() {
    const classes = useStyles();
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [orderList, setOrderList] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [inputSearch, setInputSearch] = useState('');
    const [selected, setSelected] = React.useState([]);
    const transactionDelete = useSelector((state) => state?.transaction?.transactionDelete)
    const dispatch = useDispatch();
    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    const searchTransaction = (orderId) => {
        axios({
            method: 'GET',
            url: `${BASE_URL}/transaction/search?orderId=${orderId}`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
        }).then((response) => {
            if (response.status === 200) {
                const transactions = response.data.data.map((transaction) => createData(transaction));
                setOrderList(transactions);
            }
        })
    };

    const handleChangeInput = (e) => {
        setInputSearch(e.target.value);
        searchTransaction(e.target.value);
    }


    const [openMenu, setOpenMenu] = useState(true);
    const changeOpenMenu = (value) => {
        value ?
            setOpenMenu(true) : setOpenMenu(false)
    }
    useEffect(() => {
    }, [openMenu]);

    const handleDelete = (id) => {
        if (window.confirm('Bạn chắc chắn muốn xóa giao dịch này?')) {
            dispatch(deleteTransaction(id));
        }
    };

    useEffect(
        function () {
            let config = {
                method: 'GET',
                url: `${BASE_URL}/transaction/getAllTransaction`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            };
            axios(config)
                .then((res) => {
                    if (res.status === 200) {
                        const transactions = res.data.data.map((transaction) => createData(transaction));
                        setOrderList(transactions);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        [dispatch, transactionDelete],
    );
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = colums.map((n) => n.name);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    return (
        <div className={`homePageListOrder open-menu-${openMenu ? 'true' : 'false'}`}>
            <Menu changeOpenMenu={(value) => changeOpenMenu(value)}/>
            <Paper className={'paper'}>
                <div className={classes.header}>
                    <h2 className={classes.textTitle}>Danh sách đơn hàng</h2>
                    <div className={`${classes.search} header-search-component`}>
                        <div className={`${classes.inputSearch} input-search`}>
                            <Input
                                placeholder="Search..."
                                value={inputSearch}
                                className={classes.input}
                                onChange={handleChangeInput}
                            />
                        </div>
                        <div className={`${classes.iconSearch} icon-search`}>
                            <SearchIcon/>
                        </div>
                    </div>
                </div>
                <TableContainer>
                    <Table stickyHeader aria-label="sticky table">
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={colums.length}
                        />
                        <TableBody>
                            {stableSort(orderList, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                        {colums.map((column) => {
                                            const value = row[column.id]
                                            if (column.id === 'id') {
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        <Link
                                                            to={`/infoTransaction/${value}`}
                                                            style={{cursor: 'pointer'}}
                                                        >
                                                            {value}
                                                        </Link>
                                                    </TableCell>
                                                )
                                            }

                                            if (column.id === 'status') {
                                                return (
                                                    <TableCell
                                                        key={column.id}
                                                        align={column.align}
                                                        style={{
                                                            color: value === 'Thành Công' ? '#09bd1b' : value === 'Chưa Thanh Toán' ? '#0926d7' : '#f3062a',
                                                            fontWeight: 700
                                                        }}
                                                    >
                                                        {value}
                                                    </TableCell>
                                                )
                                            }
                                            if (column.id === 'amount') {
                                                return (
                                                    <TableCell
                                                        key={column.id}
                                                        align={column.align}
                                                    >
                                                        {value}
                                                    </TableCell>
                                                )
                                            }
                                            if (column.id === 'bankCode') {
                                                return (
                                                    <TableCell
                                                        key={column.id}
                                                        align={column.align}
                                                    >
                                                        {value}
                                                    </TableCell>
                                                )
                                            }
                                            if (column.id === 'orderInfo') {
                                                return (
                                                    <TableCell
                                                        key={column.id}
                                                        align={column.align}
                                                    >
                                                        {value}
                                                    </TableCell>
                                                )
                                            }
                                            if (column.id === 'orderType') {
                                                return (
                                                    <TableCell
                                                        key={column.id}
                                                        align={column.align}
                                                    >
                                                        {value}
                                                    </TableCell>
                                                )
                                            }
                                            if (column.id === 'orderId') {
                                                return (
                                                    <TableCell
                                                        key={column.id}
                                                        align={column.align}
                                                    >
                                                        {value}
                                                    </TableCell>
                                                )
                                            }
                                            if (column.id === 'action') {
                                                return (
                                                    <TableCell
                                                        key={column.id}
                                                        align={column.align}
                                                    >
                                                        <IconButton
                                                            onClick={() => {
                                                                handleDelete(row.id)
                                                            }}
                                                        >
                                                            <DeleteForeverIcon color={"error"}/>
                                                        </IconButton>
                                                    </TableCell>
                                                )
                                            }
                                        })}
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={orderList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    )
}