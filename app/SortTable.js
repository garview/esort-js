import React from 'react';
import 'whatwg-fetch'
import {Table,Rate,Icon,message,Row,Col,Button,Input} from 'antd'
import './antd-extra.css'
const calcWeight = (record) => (record.length * record.ratingCount * record.favourited * record.averageRating)

export default class SortTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            filterDropdownVisible: false,
            tableData: [],
            searchText: '',
            filtered: false,
        }

    }

    onSearch = () => {
        const { searchText,tableData } = this.state;
        const reg = new RegExp(searchText, 'gi');
        this.setState({
            filterDropdownVisible: false,
            filtered: !!searchText,
            tableData: tableData.map((record) => {
                const match = record.name.match(reg);
                if (!match) {
                    return null;
                }
                return {
                    ...record,
                    name: (
                        <span>
              {record.name.split(reg).map((text, i) => (
                  i > 0 ? [<span className="highlight">{match[0]}</span>, text] : text
              ))}
            </span>
                    ),
                };
            }).filter(record => !!record),
        });
    }

    handleStarChange = (record, value) => {
        let msg = ""
        if (value == 1)
            msg = "不要在这里浪费时间！"
        else if (value == 2)
            msg = "很闲的话可以看下"
        else if (value == 3)
            msg = "值得推荐"
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
    onInputChange = (e) => {
        this.setState({searchText: e.target.value});
    }

    render() {
        const categories = ['artistcg','cosplay','doujinshi','gamecg','imageset','manga','misc','non-h','western']
        const columns = [{
            title: "序号",
            render: (text, record, index) => index + 1,
        }, {
            title: '分类',
            dataIndex: 'category',
            filters: categories.map(t=>({value:t,text:t})),
            onFilter: (value, record) => record.category.indexOf(value) === 0,
        }, {
            title: "番号",
            dataIndex: 'name',
            render: (text, record, index) => <div><a href={record.href} target="_blank" title={text}
                                                     style={{textOverflow:"ellipsis"}}>{text}</a></div>,
            width: "600px",
            filterDropdown: (
                <div className="custom-filter-dropdown">
                    <Input
                        ref={ele => this.searchInput = ele}
                        placeholder="Search name"
                        value={this.state.searchText}
                        onChange={this.onInputChange}
                        onPressEnter={this.onSearch}
                    />
                    <Button type="primary" onClick={this.onSearch}>Search</Button>
                </div>
            ),
            filterIcon: <Icon type="smile-o" style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }}/>,
            filterDropdownVisible: this.state.filterDropdownVisible,
            onFilterDropdownVisibleChange: (visible) => {
                this.setState({
                    filterDropdownVisible: visible,
                }, () => this.searchInput.focus());
            },
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
        return (
            <Row>
                <Col span={4}/>
                <Col span={16}>
                    <Table
                        columns={columns}
                        dataSource={this.state.tableData}
                    />
                </Col>
                <Col span={4}/>
            </Row>
        );
    }
}
