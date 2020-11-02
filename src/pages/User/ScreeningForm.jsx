import React from "react";
import { Form, Icon, Input, Button, Select, notification } from "antd";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { marketService } from "../../services/MarketService";
import { UserContext } from "../../contexts/user-context";
import { TIMEFRAMES } from "../../Utils/constants";

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};

class ScreeningForm extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    instrument: PropTypes.object.isRequired,
    startInvestmentPrice: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
    this.timeframes = TIMEFRAMES.map(v => ({
      key: v,
      value: this.mapTimeframeValue(v)
    }));
    this.marketService = marketService;
  }

  mapTimeframeValue(timeframe) {
    const match = timeframe.match(/(\d+)?(.)/);
    let str = "";
    if (match) {
      str = timeframe.replace(
        match[0],
        (match[1] || 1) + " " + match[2].toUpperCase()
      );
    }
    return str;
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        const data = {
          ...values,
          user: this.context.user.id,
          instrument: this.props.instrument.instrument_token
        };
        this.marketService
          .addToScreening(data)
          .then(screening => {
            notification.success({ message: "Screening added!" });
            this.props.onSuccess(screening);
            this.props.form.resetFields();
          })
          .catch(err => console.log(err))
          .finally(() => this.setState({ loading: false }));
      }
    });
  };

  componentWillUnmount() {
    this.setState({ loading: false });
  }

  hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="Timeframe">
          {getFieldDecorator("timeframe", {
            rules: [{ required: true, message: "Please select a timeframe" }],
            initialValue: this.timeframes[0].key
          })(
            <Select>
              {this.timeframes.map(frame => (
                <Option value={frame.key} key={frame.key}>
                  {frame.value}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="Reduce Percentage">
          {getFieldDecorator("reducePercentage", {
            rules: [
              { required: true, message: "Please input reduce percentage" }
            ],
            initialValue: 0.5
          })(
            <Input
              prefix={<Icon type="percentage" />}
              type="number"
              step="0.5"
              min="0"
              placeholder="Reduce percentage"
            />
          )}
        </Form.Item>
        <Form.Item label="Traget Percentage">
          {getFieldDecorator("targetPercentage", {
            rules: [
              { required: true, message: "Please input target percentage" }
            ],
            initialValue: 0.5
          })(
            <Input
              prefix={<Icon type="percentage" />}
              type="number"
              step="0.5"
              min="0"
              placeholder="Target percentage"
            />
          )}
        </Form.Item>
        <Form.Item label="Start Inverstment Price">
          {getFieldDecorator("startInvestmentPrice", {
            rules: [
              { required: true, message: "Please input start investment price" }
            ],
            initialValue: this.props.startInvestmentPrice
          })(
            <Input
              prefix="₹"
              type="number"
              min="0"
              step={0.01}
              placeholder="Start inverstment price"
            />
          )}
        </Form.Item>
        <Form.Item label="Max Investment Price">
          {getFieldDecorator("maxInvestmentPrice", {
            rules: [
              { required: true, message: "Please input max investment price" }
            ]
          })(
            <Input
              prefix="₹"
              type="number"
              min="0"
              placeholder="Max inverstment price"
            />
          )}
        </Form.Item>
        <Form.Item label="Last Price">
          {getFieldDecorator("lastPrice", {
            rules: [{ required: true, message: "Please input last price" }]
          })(
            <Input prefix="₹" type="number" min="0" placeholder="Last price" />
          )}
        </Form.Item>
        <div style={{ textAlign: "center" }}>
          <Button
            type="primary"
            htmlType="submit"
            disabled={this.hasErrors(getFieldsError())}
            loading={this.state.loading}
          >
            Add for Screening
          </Button>
        </div>
      </Form>
    );
  }
}

export default withRouter(
  Form.create({ name: "screening_form" })(ScreeningForm)
);

ScreeningForm.contextType = UserContext;
