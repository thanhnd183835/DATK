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
import {useDispatch} from "react-redux";
import {Link} from "react-router-dom";
import TablePagination from "@material-ui/core/TablePagination";
import Input from "@material-ui/core/Input";
import SearchIcon from "@material-ui/icons/Search";
import './listAllOrder.css';
import Menu from "../Menu/Menu";


const colums = [
    {id: 'id', label: 'ID', align: 'center'},
    {id: 'orderId', label: 'Mã đơn hàng', align: 'center'},
    {id: 'orderType', label: 'Mã hàng hóa', align: 'center'},
    {id: 'amount', label: 'Số tiền', align: 'center'},
    {id: 'bankCode', label: 'Ngân Hàng', align: 'center'},
    {id: 'orderInfo', label: 'Nội dung', align: 'center'},
    {id: 'status', label: 'Trạng thái', align: 'center'},
];

const useStyles = makeStyles({
    root: {
        // width: 'calc(100% - 280px)',
    },
    container: {
        maxHeight: 440,
    },
    textTitle: {
        marginLeft: '10px',
        color: '#0926d7'

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
        status: transaction.status === 1 ? 'Success' : transaction.status === 0 ? 'Pending' : 'Fail',
    };
}

export default function ListAllOrder() {
    const classes = useStyles();
    const [orderList, setOrderList] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [inputSearch, setInputSearch] = useState('');
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
        [dispatch],
    );
    const [openMenu, setOpenMenu] = useState(true);
    const changeOpenMenu = (value) => {
        console.log(value, 'vaule opent')
        value ?
        setOpenMenu(true) : setOpenMenu(false)
    }
    useEffect(() =>{
    }, [openMenu])

    return (
        <div className={`homePageListOrder open-menu-${openMenu ? 'true': 'false'}`}>
            <Menu changeOpenMenu = {(value) => changeOpenMenu(value)}/>
            <Paper className={'paper'}>
                <div className={classes.header}>
                    <h2 className={classes.textTitle}>List Order</h2>
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
                        <TableHead>
                            <TableRow>
                                {colums.map((column) => (
                                    <TableCell key={column.id} align={column.align}
                                               style={{color: '#0926d7', textTransform: 'uppercase'}}>
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orderList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                        {colums.map((column) => {
                                            const value = row[column.id]
                                            if (column.id === 'id') {
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        <Link
                                                              style={{cursor: 'pointer'}}>
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
                                                        style={{color: value === 'Success' ? '#09bd1b' : value === 'Pending' ? '#0926d7' : '#f3062a'}}
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