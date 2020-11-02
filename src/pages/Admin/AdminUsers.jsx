import React from "react";
import AdminLayout from "./layout/AdminLayout";
import { Table } from "antd";
import Axios from "axios";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    sorter: true,
    render: name => `${name.first} ${name.last}`,
    width: "20%"
  },
  {
    title: "Gender",
    dataIndex: "gender",
    filters: [
      { text: "Male", value: "male" },
      { text: "Female", value: "female" }
    ],
    width: "20%"
  },
  {
    title: "Email",
    dataIndex: "email"
  }
];

class AdminUsers extends React.Component {
  state = {
    data: [],
    pagination: {},
    loading: false
  };

  componentDidMount() {
    this.fetch();
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager
    });
    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters
    });
  };
  fetch = (params = {}) => {
    console.log("params:", params);
    this.setState({ loading: true });
    Axios({
      url: "https://randomuser.me/api",
      method: "get",
      params: {
        results: 3,
        ...params
      },
      responseType: "json"
    }).then(({ data }) => {
      const pagination = { ...this.state.pagination };
      // Read total count from server
      pagination.total = data.totalCount;
      this.setState({
        loading: false,
        data: data.results,
        pagination
      });
    });
  };
  render() {
    return (
      <AdminLayout>
        <Table
          columns={columns}
          rowKey={record => record.login.uuid}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
        />
      </AdminLayout>
    );
  }
}

export default AdminUsers;
