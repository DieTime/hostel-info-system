import React from "react";
import {Table, Tag, Space, Select} from "antd";

const { Option } = Select;
class Empty extends React.Component {
  state = {
    caps: null,
    classes: null,
    class: null,
    capacity: null,
    data: null,
    tableLoading: true
  };

  emptyWithParams = () => {
    fetch(`/empty/${this.state.class}/${this.state.capacity}`)
      .then((raw) => raw.json())
      .then((obj) => this.setState({ data: obj.data }))
      .then(() => this.setState({ tableLoading: false }))
  }

  componentDidMount() {
    fetch("/empty")
      .then((raw) => raw.json())
      .then((obj) => this.setState({ data: obj.data }))
      .then(() => this.setState({ tableLoading: false }))
      .then(() => {
        fetch("/classes")
          .then((raw) => raw.json())
          .then((obj) => this.setState({ classes: obj.data }))
          .then(() => {
            fetch("/capacities")
              .then((raw) => raw.json())
              .then((obj) => this.setState({ caps: obj.data }))
          })
      });
  }

  render() {
    const columns = [
      {
        title: "Номер",
        dataIndex: "number",
        key: "number",
      },
      {
        title: "Вместимость",
        dataIndex: "capacity",
        key: "capacity",
      },
      {
        title: "Класс",
        dataIndex: "class",
        key: "class",
      },
      {
        title: "Цена за день",
        dataIndex: "day_price",
        key: "day_price",
      },
      {
        title: "Животные",
        dataIndex: "animals",
        key: "animals",
        render: (val) => (
          <Tag color={val === 0 ? "red" : "green"}>
            {val === 0 ? "Нет" : "Да"}
          </Tag>
        ),
      },
      {
        title: "Кандиционер",
        dataIndex: "candidate",
        key: "candidate",
        render: (val) => (
          <Tag color={val === 0 ? "red" : "green"}>
            {val === 0 ? "Нет" : "Да"}
          </Tag>
        ),
      },
      {
        title: "Отопление",
        dataIndex: "heating",
        key: "heating",
        render: (val) => (
          <Tag color={val === 0 ? "red" : "green"}>
            {val === 0 ? "Нет" : "Да"}
          </Tag>
        ),
      },
    ];

    return (
      <div style={{width: "100%"}}>
        <Space style={{ margin: 16, marginBottom: 0 }}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
            <h3 style={{margin: 0, marginRight: 10}}>Число мест:</h3>
            {this.state.caps ?
              <Select placeholder="Любое" style={{width: 100}} onChange={async (value) => {
                await this.setState({capacity: value})
                await this.emptyWithParams()
              }}>
                <Option value={null}>Любое</Option>
                {this.state.caps.map(el =>
                  <Option key={el.capacity} value={el.capacity}>{el.capacity}</Option>
                )}
              </Select>
              : <Select style={{width: 100}} loading={true} disabled/>}
          </div>
          <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
            <h3 style={{margin: 0, marginLeft: 10, marginRight: 10}}>Класс:</h3>
            {this.state.classes ?
              <Select placeholder="Любой" style={{width: 100}} onChange={async (value) => {
                await this.setState({class: value})
                await this.emptyWithParams()
              }}>
                <Option value={null}>Любой</Option>
                {this.state.classes.map(el =>
                  <Option key={el.class} value={el.class}>{el.class}</Option>
                )}
              </Select>
              : <Select style={{width: 100}} loading={true} disabled/>}
          </div>
        </Space>
          <Table
            style={{padding: 16, flex: 1}}
            columns={columns}
            dataSource={this.state.data}
            pagination={false}
            size={"small"}
            tableLayout={"auto"}
            onChange={this.handleChange}
            bordered={true}
            loading={this.state.tableLoading}
          />
      </div>
    );
  }
}

export default Empty;
