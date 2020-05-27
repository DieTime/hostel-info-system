import React, {Component} from 'react';
import {Table, Tag} from "antd";

class TodayTomorrow extends Component {
  state = {
    data: null,
    tableLoading: true,
  }

  componentDidMount() {
    fetch("/today_tomorrow")
      .then(raw => raw.json())
      .then(obj => this.setState({data: obj.data}))
      .then(() => this.setState({ tableLoading: false }))
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
        render: val => (
          <Tag color={val === 0 ? "red" : "green"}>
            {val === 0 ? "Нет" : "Да"}
          </Tag>
        ),
      },
      {
        title: "Кандиционер",
        dataIndex: "candidate",
        key: "candidate",
        render: val => (
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
      {
        title: "Освобождается",
        dataIndex: "delta",
        key: "delta",
        render: (val) => val === 0 ? "Сегодня" : "Завтра",
      },
    ];

    return (
      <Table
        style={{padding: 16, flex: 1}}
        columns={columns}
        dataSource={this.state.data}
        pagination={false}
        size={"small"}
        tableLayout={"auto"}
        bordered={true}
        loading={this.state.tableLoading}
      />
    );
  }
}

export default TodayTomorrow;