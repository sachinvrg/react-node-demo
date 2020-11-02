import React, { Component } from "react";
import { Table, Button, notification, Modal, Tooltip } from "antd";
import { marketService } from "../../services/MarketService";
import { UserContext } from "../../contexts/user-context";
import ScreeningForm from "./ScreeningForm";
import { EXCHANGES, PAGINATION_PER_PAGE } from "../../Utils/constants";

export default class FavoriteStocks extends Component {
  screeningButtons = [];

  state = {
    loading: false,
    visible: false,
    instrument: {},
    startInvestmentPrice: undefined,
    pagination: {
      pageSize: PAGINATION_PER_PAGE,
      current: 1
    },
    filters: {},
    sorter: {},
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
      render: (old, record, index) => (
        <UserContext.Consumer>
          {({ user }) => (
            <>
              <Tooltip title="Remove from favorites">
                <Button
                  size="small"
                  type="link"
                  icon="delete"
                  style={{ color: "red" }}
                  onClick={this.removeStock.bind(
                    this,
                    record.instrument_token,
                    index
                  )}
                ></Button>
              </Tooltip>
              <Tooltip title="Add to screening">
                <Button
                  type="link"
                  ref={node => this.screeningButtons.splice(index, 1, node)}
                  icon="project"
                  onClick={this.showModal.bind(this, record, index)}
                ></Button>
              </Tooltip>
            </>
          )}
        </UserContext.Consumer>
      )
    }
  ];

  constructor(props) {
    super(props);
    this.marketService = marketService;
  }

  showModal(instrument, index) {
    this.screeningButtons[index] &&
      this.screeningButtons[index].setState({ loading: true });
    this.marketService
      .getQuote(instrument.instrument_token)
      .then(resp => {
        let startInvestmentPrice = undefined;
        try {
          startInvestmentPrice = Object.values(resp)[0].last_price;
        } catch (e) {}

        this.setState({
          instrument,
          visible: true,
          startInvestmentPrice
        });
      })
      .finally(
        () =>
          this.screeningButtons[index] &&
          this.screeningButtons[index].setState({ loading: false })
      );
  }

  closeModal = e => {
    this.setState({
      visible: false
    });
  };

  removeStock(id, index) {
    this.marketService.removeStock(id).then(resp => {
      this.screeningButtons.splice(index, 1);
      this.fetch();
      notification.success({
        title: "Success!",
        message: resp.msg
      });
    });
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

  fetch() {
    this.setState({ loading: true });
    const {
      pagination: { current: page, pageSize: limit },
      sorter: { field: sortBy, order: sort },
      filters
    } = this.state;
    this.marketService
      .favoriteStocks({
        page,
        limit,
        sortBy,
        sort,
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

  handleAddedScreening(screening) {
    this.setState({ visible: false });
  }

  render() {
    return (
      <>
        <Table
          columns={this.columns}
          rowKey={record => record.instrument_token}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
        />
        <Modal
          title={"Add " + this.state.instrument.name + " Stock for screening"}
          visible={this.state.visible}
          onCancel={this.closeModal}
          footer={null}
        >
          <ScreeningForm
            onSuccess={this.handleAddedScreening.bind(this)}
            instrument={this.state.instrument}
            startInvestmentPrice={this.state.startInvestmentPrice}
          ></ScreeningForm>
        </Modal>
      </>
    );
  }
}

FavoriteStocks.contextType = UserContext;
