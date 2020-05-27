import React, {Component} from "react";
import {Table} from "antd";

class Archive extends Component {
  state = {
    data: null,
    tableLoading: true,
  }

  componentDidMount() {
    fetch("/archive")
      .then(raw => raw.json())
      .then(obj => this.setState({data: obj.data}))
      .then(() => this.setState({ tableLoading: false }))
  }

  render() {
    const columns = [
      {
        title: "Имя",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Фамилия",
        dataIndex: "surname",
        key: "surname",
      },
      {
        title: "Отчество",
        dataIndex: "patronym",
        key: "patronym",
      },
      {
        title: "Паспорт",
        dataIndex: "passport",
        key: "passport",
        render: val => `${val.toString().slice(0, 4)} ${val.toString().slice(4)}`
      },
      {
        title: "Номер",
        dataIndex: "number",
        key: "number",
      },
      {
        title: "Дата заселения",
        dataIndex: "start_date",
        key: "start_date",
        render: val => new Date(val).toLocaleDateString()
      },
      {
        title: "Дата выселения",
        dataIndex: "end_date",
        key: "end_date",
        render: val => new Date(val).toLocaleDateString()
      },
      {
        title: "Стоимость проживания",
        dataIndex: "price",
        key: "price",
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

export default Archive;
