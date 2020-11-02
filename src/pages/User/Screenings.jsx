import React, { Component } from "react";
import {
  Table,
  Button,
  notification,
  Descriptions,
  Tag,
  Tooltip,
  Modal,
  Tabs
} from "antd";
import { marketService } from "../../services/MarketService";
import { UserContext } from "../../contexts/user-context";
import StorageService from "../../services/StorageService";
import { PAGINATION_PER_PAGE, WS_URL } from "../../Utils/constants";
import {
  numberFormat,
  currencyFormat,
  dateTimeFormat,
  percetFormat
} from "../../Utils/helpers";
const { TabPane } = Tabs;

export default class Screenings extends Component {
  wsConnection;
  columns = [
    {
      title: "Stock Name",
      dataIndex: "instrument.name",
      sorter: true
    },
    {
      title: "Timeframe",
      dataIndex: "timeframeValue",
      sorter: true
    },
    {
      title: "Reduce",
      dataIndex: "reducePercentage",
      sorter: true,
      render: (old, record) => percetFormat(record.reducePercentage)
    },
    {
      title: "Target",
      dataIndex: "targetPercentage",
      sorter: true,
      render: (old, record) => percetFormat(record.targetPercentage)
    },
    {
      title: "Screening",
      key: "lastrun",
      render: (old, record) =>
        record.lastResult ? (
          record.lastResult.isPassed ? (
            <Tag color="green">Passed</Tag>
          ) : (
            <Tag color="volcano">Failed</Tag>
          )
        ) : (
          <Tag color="cyan">Pending</Tag>
        )
    },
    {
      title: "Trading",
      key: "trading",
      render: (old, record) =>
        record.lastResult ? (
          record.lastResult.isCompleted ? (
            <Tag color="green">Completed</Tag>
          ) : (
            <Tag color="volcano">Failed</Tag>
          )
        ) : (
          <Tag color="cyan">Pending</Tag>
        )
    },
    {
      title: "Status",
      key: "status",
      render: (old, record) =>
        record.isRunning ? (
          <Tag color="green">Running</Tag>
        ) : (
          <Tag color="volcano">Stopped</Tag>
        )
    },
    {
      title: "Added At",
      dataIndex: "createdAt",
      sorter: true,
      key: "createdat",
      render: (old, record) => dateTimeFormat(record.createdAt)
    },
    {
      title: "Actions",
      key: "actions",
      render: (old, record) => (
        <>
          <Tooltip title="Delete screening">
            <Button
              type="link"
              size="small"
              icon="delete"
              style={{ color: "red" }}
              onClick={this.removeScreening.bind(this, record.id)}
            ></Button>
          </Tooltip>
          {record.isRunning ? (
            <Tooltip title="Stop screening">
              <Button
                type="link"
                size="small"
                icon="stop"
                style={{ color: "red" }}
                onClick={this.changeStatus.bind(this, record.id, false)}
              ></Button>
            </Tooltip>
          ) : (
            <Tooltip title="Start screening">
              <Button
                type="link"
                size="small"
                icon="play-circle"
                style={{ color: "green" }}
                onClick={this.changeStatus.bind(this, record.id, true)}
              ></Button>
            </Tooltip>
          )}
        </>
      )
    }
  ];

  paramsColumns = [
    {
      title: "Checked",
      key: "checkedAt",
      sorter: true,
      render: (old, record) => dateTimeFormat(record.checkedAt)
    },
    {
      title: "Next Check",
      key: "nextCheckAt",
      sorter: true,
      render: (old, record) => dateTimeFormat(record.nextCheckAt)
    },
    {
      title: "Status",
      key: "isPassed",
      render: (old, record) =>
        record.isPassed ? (
          <Tag color="green">Passed</Tag>
        ) : (
          <Tag color="volcano">Failed</Tag>
        )
    },
    {
      title: "Interval",
      key: "interval",
      dataIndex: "interval"
    },
    {
      title: "CL",
      key: "conversionLine",
      render: (old, record) => numberFormat(record.conversionLine)
    },
    {
      title: "BL",
      key: "baseLine",
      render: (old, record) => numberFormat(record.baseLine)
    },
    {
      title: "CL 26",
      key: "conversionLine26",
      render: (old, record) => numberFormat(record.conversionLine26)
    },
    {
      title: "BL 26",
      key: "baseLine26",
      render: (old, record) => numberFormat(record.baseLine26)
    },
    {
      title: "LSA",
      key: "spanA",
      render: (old, record) => numberFormat(record.spanA)
    },
    {
      title: "LSB",
      key: "spanB",
      render: (old, record) => numberFormat(record.spanB)
    },
    {
      title: "Closing Price",
      key: "closePrice",
      render: (old, record) => numberFormat(record.closePrice)
    }
  ];

  resultsColumn = [
    {
      title: "Created",
      key: "checkedAt",
      sorter: true,
      render: (old, record) => dateTimeFormat(record.createdAt)
    },
    {
      title: "Screening",
      key: "screening",
      render: (old, record) =>
        record.isPassed ? (
          <Tag color="green">Passed</Tag>
        ) : (
          <Tag color="volcano">Failed</Tag>
        )
    },
    {
      title: "Trading",
      key: "trading",
      render: (old, record) =>
        record.isCompleted ? (
          <Tag color="green">Completed</Tag>
        ) : (
          <Tag color="volcano">Failed</Tag>
        )
    },
    {
      title: "CL",
      key: "conversionLine",
      render: (old, record) =>
        numberFormat(
          record.screeningParams && record.screeningParams.conversionLine
        )
    },
    {
      title: "BL",
      key: "baseLine",
      render: (old, record) =>
        numberFormat(record.screeningParams && record.screeningParams.baseLine)
    },
    {
      title: "LSA",
      key: "spanA",
      render: (old, record) =>
        numberFormat(record.screeningParams && record.screeningParams.spanA)
    },
    {
      title: "LSB",
      key: "spanB",
      render: (old, record) =>
        numberFormat(record.screeningParams && record.screeningParams.spanB)
    },
    {
      title: "Closing Price",
      key: "closePrice",
      render: (old, record) =>
        numberFormat(
          record.screeningParams && record.screeningParams.closePrice
        )
    }
  ];

  futureTradeColumns = [
    {
      title: "Share Price",
      key: "shareprice",
      render: (old, record) => currencyFormat(record.sharePrice)
    },
    {
      title: "No. of shares",
      dataIndex: "noOfSharesToBuy"
    },
    {
      title: "Actual Investment",
      key: "actualinvestment",
      render: (old, record) => currencyFormat(record.actualInvestment)
    },
    {
      title: "Target Price",
      key: "targetprice",
      render: (old, record) => currencyFormat(record.targetPrice)
    }
  ];

  state = {
    loading: false,
    selectedRowKeys: [],
    pagination: {
      pageSize: PAGINATION_PER_PAGE,
      current: 1
    },
    resultData: [],
    resultPagination: {
      pageSize: PAGINATION_PER_PAGE,
      current: 1
    },
    filters: {},
    sorter: {},
    data: [],
    isWSOpened: false,
    screeningId: []
  };

  constructor(props) {
    super(props);
    this.marketService = marketService;
  }

  componentDidMount() {
    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    this.wsConnection = new WebSocket(WS_URL + "/screenings");
    this.wsConnection.onopen = this.handleWSOpen;
    this.wsConnection.onerror = this.handleWSError;
    this.wsConnection.onmessage = this.handleWSMessage;
    this.fetch();
  }

  componentWillUnmount() {
    this.wsConnection.close();
    this.setState({ isWSOpened: false });
  }

  handleWSError = e => {
    console.log(e);
  };

  handleWSOpen = () => {
    this.setState({ isWSOpened: true });
  };

  handleWSClose = () => {
    this.setState({ isWSOpened: false });
  };

  handleWSMessage = message => {
    try {
      const { data: msg } = JSON.parse(message.data);
      if (msg.data.isPassed) {
        notification.success({
          message: msg.event,
          description: msg.data.failedReason
        });
      } else {
        notification.error({
          message: msg.event,
          description: msg.data.failedReason
        });
      }
      this.fetch();
    } catch (e) {
      console.log("This doesn't look like a valid JSON: ", message.data);
      return;
    }
    // handle incoming message
  };

  addStock(id) {
    this.marketService.addStock(id).then(resp => {
      const user = { ...this.context.user };
      if (user.favoriteStocks && Array.isArray(user.favoriteStocks)) {
        user.favoriteStocks.push(id);
      } else {
        user.favoriteStocks = [id];
      }
      this.context.updateUser(user);
      StorageService.setItem("user", user);
      notification.success({
        message: resp.msg
      });
    });
  }

  removeScreening(id) {
    Modal.confirm({
      title: "Are you sure?",
      content: "You want to remove this screening?",
      onOk: () => {
        this.marketService.removeScreening(id).then(resp => {
          notification.success({
            message: "Success!",
            description: resp.msg
          });
          this.fetch();
        });
      }
    });
  }

  changeStatus(id, status) {
    Modal.confirm({
      title: "Are you sure?",
      content: `You want to ${status ? "Start" : "Stop"} this screening?`,
      onOk: () => {
        this.marketService.changeScreeningStatus({ id, status }).then(resp => {
          notification.success({ message: "Success!", description: resp.msg });
          this.fetch();
        });
      }
    });
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

  handleResultTableChange = resultPagination => {
    this.setState(
      {
        resultPagination
      },
      () => this.fetchResults()
    );
  };

  fetch() {
    this.setState({ loading: true });
    const {
      pagination: { current, pageSize },
      sorter,
      filters
    } = this.state;
    this.marketService
      .getScreenings({
        page: current,
        limit: pageSize,
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

  fetchResults() {
    this.setState({ loadingResults: true });
    const {
      resultPagination: { current, pageSize },
      screeningId
    } = this.state;
    this.marketService
      .getResults(screeningId, {
        page: current,
        limit: pageSize
      })
      .then(({ data, meta: { total } }) => {
        const resultPagination = { ...this.state.resultPagination };
        resultPagination.total = total;
        this.setState({
          loadingResults: false,
          resultData: data,
          resultPagination
        });
      })
      .catch(err => {
        this.setState({ loadingResults: false });
      });
  }

  handleTabChange = tab => {
    // if (tab === "results") {
    //   this.fetchResults();
    // }
  };

  handleExpandedRowChange = screeningId => {
    this.setState(
      {
        screeningId: screeningId.length
          ? [screeningId[screeningId.length - 1]]
          : []
      },
      () => screeningId.length && this.fetchResults()
    );
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  render() {
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <Tooltip title="Start selected screenings">
            <Button
              type="link"
              onClick={this.changeStatus.bind(this, selectedRowKeys, true)}
              disabled={!hasSelected}
              icon="play-circle"
              style={{ color: "green" }}
              loading={loading}
            ></Button>
          </Tooltip>
          <Tooltip title="Stop selected screenings">
            <Button
              type="link"
              onClick={this.changeStatus.bind(this, selectedRowKeys, false)}
              disabled={!hasSelected}
              loading={loading}
              icon="stop"
              style={{ color: "red" }}
            ></Button>
          </Tooltip>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
          </span>
        </div>
        <Table
          key="screenings"
          rowSelection={rowSelection}
          onExpandedRowsChange={this.handleExpandedRowChange}
          expandedRowKeys={this.state.screeningId}
          scroll={{ x: true }}
          expandedRowRender={record => (
            <Tabs
              defaultActiveKey="details"
              type="card"
              onChange={this.handleTabChange}
            >
              <TabPane tab="Details" key="details">
                <Descriptions bordered={true} style={{ marginBottom: 24 }}>
                  <Descriptions.Item label="Screening ID">
                    {record.id}
                  </Descriptions.Item>
                  <Descriptions.Item label="Timeframe">
                    {record.timeframeValue}
                  </Descriptions.Item>
                  <Descriptions.Item label="Reduce Percentage">
                    {percetFormat(record.reducePercentage)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Target Percentage">
                    {percetFormat(record.targetPercentage)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Start Investment">
                    {currencyFormat(record.startInvestmentPrice)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Max Investment">
                    {currencyFormat(record.maxInvestmentPrice)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Last Price">
                    {currencyFormat(record.lastPrice)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Actual Investment Price">
                    {currencyFormat(record.actualInvestmentPrice)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Passed Max Investment?">
                    {typeof record.isPassedMaxInvestmentCheck ===
                    "undefined" ? (
                      "N/A"
                    ) : record.isPassedMaxInvestmentCheck ? (
                      <Tag color="green">Yes</Tag>
                    ) : (
                      <Tag color="volcano">No</Tag>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Failed Reason">
                    {record.lastResult && record.lastResult.failedReason}
                  </Descriptions.Item>
                  <Descriptions.Item label="Instrument Token">
                    {record.instrument.instrument_token}
                  </Descriptions.Item>
                  <Descriptions.Item label="Trading Symbol">
                    {record.instrument.tradingsymbol}
                  </Descriptions.Item>
                  <Descriptions.Item label="Exchange">
                    {record.instrument.exchange}
                  </Descriptions.Item>
                </Descriptions>
              </TabPane>
              <TabPane tab="Future Trades" key="futureTrades">
                <Table
                  columns={this.futureTradeColumns}
                  dataSource={record.futureTrades}
                  rowKey={record => record.id}
                  key="futureTrades"
                ></Table>
              </TabPane>
              <TabPane tab="Parameters" key="params">
                <Table
                  columns={this.paramsColumns}
                  dataSource={record.instrument.screeningParams}
                  rowKey={record => record.id}
                  key="params"
                  // scroll={{ x: true }}
                ></Table>
              </TabPane>
              <TabPane tab="Results" key="results">
                <Table
                  columns={this.resultsColumn}
                  key="results"
                  rowKey={record => record.id}
                  dataSource={this.state.resultData}
                  pagination={this.state.resultPagination}
                  loading={loading}
                  onChange={this.handleResultTableChange}
                ></Table>
              </TabPane>
            </Tabs>
          )}
          columns={this.columns}
          rowKey={record => record.id}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          loading={loading}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

Screenings.contextType = UserContext;
