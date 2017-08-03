import React from 'react';
import 'whatwg-fetch'
import {Table,Rate,Icon,message,Row,Col} from 'antd'
const calcWeight = (record) => (record.length * record.ratingCount * record.favourited * record.averageRating)

export default class SortTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.columns = [{
            title: "序号",
            render: (text, record, index) => index + 1,
        }, {
            title: "番号",
            dataIndex: 'name',
            render: (text, record, index) => <a href={record.href} target="_blank">{text}</a>,
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
            sorter: (a, b) => moment(a.eInputDate, "YYYYMMDD") - moment(b.eInputDate, "YYYYMMDD"),
        }, {
            title: '权重',
            render: (text, record, index) => Math.round(calcWeight(record)),
            dataIndex: 'weight',
            sorter: (a, b) =>calcWeight(a) - calcWeight(b),
        }, {
            title: '自己的评分',
            dataIndex: 'score',
            render: (text, record, index) =><Rate character={<Icon type="heart" />} count={3} value={text}
                                                  onChange={value=>this.handleStarChange(record,value)}/>,
        }]
    }

    handleStarChange = (record, value) => {
        let msg = ""
        if (value == 1)
            msg = "没剧情、画风差，烂！"
        else if (value == 2)
            msg = "剧情烂俗、画风可以，一般"
        else if (value == 3)
            msg = "剧情不错、画风可以，推荐"
        let success = false
        fetch(`http://localhost:8080/rateBook?bookId=${record.bookId}&score=${value}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
        }).then(resp=> {
            if (resp.status == "204") {
                this.loadTableData();
                success = true
            }
        })
        setTimeout(()=> {
            if (success)
                message.info(msg)
            else
                message.error("评分失败")
        }, 300)


    }

    componentDidMount() {
        this.loadTableData();
    }

    loadTableData = () => {
        const url = "http://localhost:8080/getBooks"
        fetch(url)
            .then(resp=>resp.json())
            .then(data=> {
                data.forEach(t=>t.key = t.bookId)
                this.setState({tableData: data})
            })
        ;
    }

    render() {
        return (
            <Row>
                <Col span={4} />
                <Col span={16} >
                    <Table
                        columns={this.columns}
                        dataSource={this.state.tableData}
                    />
                </Col>
                <Col span={4} />
            </Row>
        );
    }
}
