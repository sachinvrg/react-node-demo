import React, { Component } from "react";
import { Table, notification, Input, Icon, Tooltip, Button } from "antd";
import { marketService } from "../../services/MarketService";
import { UserContext } from "../../contexts/user-context";
import { EXCHANGES, PAGINATION_PER_PAGE } from "./../../Utils/constants";
const { Search } = Input;

export default class Stocks extends Component {
  addButtons = [];
  removeButtons = [];
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
      title: "Trading Symbol",
      dataIndex: "tradingsymbol",
      sorter: true
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: true
    },
    {
      title: "Last Price",
      dataIndex: "last_price",
      sorter: true
    },
    {
      title: "Lot Size",
      dataIndex: "lot_size"
    },
    {
      title: "Type",
      dataIndex: "instrument_type"
    },
    {
      title: "Exchange",
      dataIndex: "exchange",
      filters: EXCHANGES.map(value => ({ text: value, value }))
    },
    {
      title: "Actions",
      key: "action",
      align: "center",
      render: (record, old, index) =>
        record.isFavorite ? (
          <Tooltip title="Remove from favorites">
            <Button
              type="link"
              style={{ color: "red" }}
              ref={node => this.removeButtons.splice(index, 1, node)}
              onClick={this.removeStock.bind(
                this,
                record.instrument_token,
                index
              )}
            >
              <Icon type="heart" theme="filled" />
            </Button>
          </Tooltip>
        ) : (
          <Tooltip title="Add to favorites">
            <Button
              type="link"
              style={{ color: "red" }}
              icon="heart"
              ref={node => this.addButtons.splice(index, 1, node)}
              onClick={this.addStock.bind(this, record.instrument_token, index)}
            />
          </Tooltip>
        )
    }
  ];

  constructor(props) {
    super(props);
    this.marketService = marketService;
  }

  addStock(id, index) {
    this.addButtons[index] &&
      this.addButtons[index].setState({ loading: true });
    this.marketService
      .addStock(id)
      .then(resp => {
        this.fetch();
        notification.success({
          message: resp.msg
        });
      })
      .finally(
        () =>
          this.addButtons[index] &&
          this.addButtons[index].setState({ loading: false })
      );
  }

  removeStock(id, index) {
    // this.removeButtons[index] &&
    //   this.removeButtons[index].setState({ loading: true });
    this.marketService.removeStock(id).then(resp => {
      this.fetch();
      notification.success({
        title: "Success!",
        message: resp.msg
      });
    });
    // .finally(
    //   () =>
    //     this.removeButtons[index] &&
    //     this.removeButtons[index].setState({ loading: false })
    // );
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

  async fetch() {
    this.setState({ loading: true });
    const {
      pagination: { current: page, pageSize: limit },
      sorter: { field: sortBy, order: sort },
      filters,
      searchKeyword
    } = this.state;
    return this.marketService
      .getStocks({
        page,
        limit,
        sortBy,
        sort,
        searchKeyword,
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

  render() {
    return (
      <>
        <Search
          placeholder="Search for instrument..."
          onSearch={this.handleSearch.bind(this)}
          style={{ width: 200, marginLeft: 15 }}
        />
        <Table
          columns={this.columns}
          rowKey={record => record.instrument_token}
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
