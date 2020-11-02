import React, { Component } from "react";
import { Table, Input, Tag, DatePicker, Row, Col } from "antd";
import { marketService } from "../../services/MarketService";
import { UserContext } from "../../contexts/user-context";
import {
  TRANSACTION_TYPES,
  EXCHANGES,
  ORDER_TYPES,
  ORDER_VALIDITIES,
  ORDER_PRODUCTS,
  ORDER_STATUSES,
  ORDER_STATUS_COLORS,
  PAGINATION_PER_PAGE
} from "./../../Utils/constants";
import { dateTimeFormat, currencyFormat } from "../../Utils/helpers";
const { Search } = Input;
const { RangePicker } = DatePicker;

export default class Stocks extends Component {
  state = {
    loading: false,
    pagination: {
      pageSize: PAGINATION_PER_PAGE,
      current: 1
    },
    sorter: {},
    filters: {},
    searchKeyword: "",
    data: []
  };

  columns = [
    {
      title: "Date",
      dataIndex: "createdAt",
      sorter: true,
      render: (old, record) => dateTimeFormat(record.createdAt),
      fixed: "left"
    },
    {
      title: "Stock",
      dataIndex: "instrument.name",
      sorter: true,
      fixed: "left"
    },
    {
      title: "Transaction Type",
      dataIndex: "transactionType",
      filters: TRANSACTION_TYPES.map(value => ({
        text: value.capitalize(),
        value
      }))
    },
    {
      title: "Order Type",
      dataIndex: "orderType",
      filters: ORDER_TYPES.map(value => ({ text: value.capitalize(), value }))
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      sorter: true
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: true,
      render: (old, record) => currencyFormat(record.price)
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: true,
      filters: ORDER_STATUSES.map(value => ({
        text: value.capitalize(),
        value
      })),
      render: (old, record) => (
        <Tag color={ORDER_STATUS_COLORS[record.status]}>
          {record.status.capitalize()}
        </Tag>
      )
    },
    {
      title: "Exchange",
      dataIndex: "exchange",
      sorter: true,
      filters: EXCHANGES.map(value => ({
        text: value,
        value
      }))
    },
    {
      title: "Validity",
      dataIndex: "validity",
      sorter: true,
      filters: ORDER_VALIDITIES.map(value => ({
        text: value.capitalize(),
        value
      }))
    },
    {
      title: "Product",
      dataIndex: "product",
      sorter: true,
      filters: ORDER_PRODUCTS.map(value => ({
        text: value,
        value
      }))
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
      searchKeyword
    } = this.state;
    this.marketService
      .getOrders({
        page,
        limit,
        searchKeyword,
        sortBy: sorter.field,
        sort: sorter.order,
        ...filters
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
        <Table
          scroll={{ x: true }}
          columns={this.columns}
          rowKey={record => record._id}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
        />
      </>
    );
  }
}

Stocks.contextType = UserContext;
