import React, { Component } from "react";
import { Table, Input, Tag, DatePicker, Row, Col, Tabs } from "antd";
import { marketService } from "../../services/MarketService";
import { UserContext } from "../../contexts/user-context";
import { PAGINATION_PER_PAGE } from "./../../Utils/constants";
const { Search } = Input;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

export default class Positions extends Component {
  state = {
    loading: false,
    pagination: {
      pageSize: PAGINATION_PER_PAGE,
      current: 1
    },
    sorter: {},
    status: "OPEN",
    filters: {},
    searchKeyword: "",
    data: []
  };

  openPositionColumns = [
    {
      title: "Date",
      dataIndex: "createdAt",
      sorter: true,
      render: (old, record) => new Date(record.createdAt).toLocaleString()
    },
    {
      title: "Stock",
      dataIndex: "instrument.name",
      sorter: true
    },
    {
      title: "Total Investment",
      dataIndex: "totalInvestment",
      sorter: true,
      render: (old, record) =>
        record.averagePrice ? "₹" + record.averagePrice : "N/A"
    },
    {
      title: "No. of shares",
      dataIndex: "noOfShares",
      sorter: true
    },
    {
      title: "Current Market price",
      dataIndex: "currentMarketPrice",
      sorter: true,
      render: (old, record) =>
        record.averagePrice ? "₹" + record.averagePrice : "N/A"
    },
    {
      title: "Average price",
      dataIndex: "averagePrice",
      sorter: true,
      render: (old, record) =>
        record.averagePrice ? "₹" + record.averagePrice : "N/A"
    },
    {
      title: "P/L",
      dataIndex: "profileOrLoss",
      sorter: true,
      render: (old, record) =>
        record.price ? <Tag>{"₹" + record.price}</Tag> : "N/A"
    }
  ];

  closedPositionColumns = [
    {
      title: "Start At",
      dataIndex: "createdAt",
      sorter: true,
      render: (old, record) => new Date(record.createdAt).toLocaleString()
    },
    {
      title: "End At",
      dataIndex: "closedAt",
      sorter: true,
      render: (old, record) => new Date(record.createdAt).toLocaleString()
    },
    {
      title: "Stock",
      dataIndex: "instrument.name",
      sorter: true
    },
    {
      title: "maxInvestment",
      dataIndex: "maxInvestment",
      sorter: true,
      render: (old, record) =>
        record.averagePrice ? "₹" + record.averagePrice : "N/A"
    },
    {
      title: "P/L",
      dataIndex: "profileOrLoss",
      sorter: true,
      render: (old, record) =>
        record.price ? <Tag>{"₹" + record.price}</Tag> : "N/A"
    }
  ];

  constructor(props) {
    super(props);
    this.marketService = marketService;
  }

  componentDidMount() {
    this.fetch();
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.setState(
      {
        pagination,
        filters,
        sorter
      },
      () => this.fetch()
    );
  };

  handleSearch(searchKeyword) {
    this.setState({ searchKeyword }, () => this.fetch());
  }

  fetch() {
    this.setState({ loading: true });
    const {
      pagination: { current: page, pageSize: limit },
      sorter,
      filters,
      searchKeyword,
      status,
    } = this.state;
    this.marketService
      .getPositions({
        page,
        limit,
        searchKeyword,
        sortBy: sorter.field,
        sort: sorter.order,
        ...filters,
        status
      })
      .then(({ data, meta: { total } }) => {
        const pagination = { ...this.state.pagination };
        pagination.total = total;
        this.setState({
          loading: false,
          data,
          pagination
        });
      })
      .catch(err => {
        this.setState({ loading: false });
      });
  }

  handleDateFilter(dates, dateRange) {
    let { filters } = this.state;
    filters = { ...filters, dateRange };
    this.setState({ filters }, () => this.fetch());
  }

  handleTabChange = status => {
    let { filters } = this.state;
    filters = { ...filters, status };
    this.setState({ filters }, () => this.fetch());
  };

  render() {
    return (
      <>
        <Row gutter={14}>
          <Col span={6}>
            <Search
              placeholder="Enter stock name"
              onSearch={this.handleSearch.bind(this)}
            />
          </Col>
          <Col span={12} offset={6}>
            <RangePicker
              onChange={this.handleDateFilter.bind(this)}
            ></RangePicker>
          </Col>
        </Row>
        <Tabs defaultActiveKey="openPositions" onChange={this.handleTabChange}>
          <TabPane tab="Open Positions" key="OPEN">
            <Table
              columns={this.openPositionColumns}
              rowKey={record => record._id}
              dataSource={this.state.data}
              pagination={this.state.pagination}
              loading={this.state.loading}
              onChange={this.handleTableChange}
            />
          </TabPane>
          <TabPane tab="Closed Positions" key="CLOSED">
            <Table
              columns={this.closedPositionColumns}
              rowKey={record => record._id}
              dataSource={this.state.data}
              pagination={this.state.pagination}
              loading={this.state.loading}
              onChange={this.handleTableChange}
            />
          </TabPane>
        </Tabs>
      </>
    );
  }
}

Positions.contextType = UserContext;
