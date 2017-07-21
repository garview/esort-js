import React from 'react';
import {render} from 'react-dom';
import moment from 'moment'

//import { Provider } from 'react-redux'
//import rootRoute from './RootRoute'
require("babel-polyfill");
//import store from './store'
//import { Router,browserHistory } from 'react-router';
import 'whatwg-fetch'
import {Table} from 'antd'
const columns = [{
    title: "序号",
    render: (text, record, index) => index + 1,
}, {
    title: "番号",
    dataIndex: 'name',
    render: (text, record, index) => <a href={record.href} target="_blank" >{text}</a>,
}, {
    title: '页数',
    dataIndex: 'length',
    sorter: (a, b) => a.length - b.length,
}, {
    title: '评分人数',
    dataIndex: 'ratingCount',
    sorter: (a, b) => a.ratingCount - b.ratingCount,
}, {
    title: '收藏数',
    dataIndex: 'favourited',
    sorter: (a, b) => a.favourited - b.favourited,
}, {
    title: '平均评分',
    dataIndex: 'averageRating',
    sorter: (a, b) => a.averageRating - b.averageRating,
}, {
    title: 'e站入库时间',
    dataIndex: 'eInputDate',
    sorter: (a, b) => moment(a.eInputDate,"YYYYMMDD")-moment(b.eInputDate,"YYYYMMDD") ,
}]
class SortTable extends React.Component {
    constructor(props){
        super(props)
        this.state={}
    }

    componentDidMount() {
        const url = "http://localhost:8080/getBooks"
        fetch(url)
            .then(resp=>resp.json())
            .then(data=>this.setState({tableData: data}))
        ;
    }

    render() {
        return (
            <Table
                columns={columns}
                dataSource={this.state.tableData}
            />
        );
    }
}

render((
   <SortTable />
), document.getElementById('root'))
