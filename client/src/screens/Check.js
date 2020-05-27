import React, {Component} from 'react';
import {Table, Input, Button, message} from "antd";

class Check extends Component {
  state = {
    data: null,
    tableLoading: false,
    surname: null,
    name: null,
    patronym: null
  }

  checkPerson = (name, surname, patronym) => {
    fetch(`/reservation/${name.trim()}/${surname.trim()}/${patronym.trim()}`)
      .then(raw => raw.json())
      .then(obj => {
        this.setState({data: obj.data})
        if (obj.data.length > 0)
          message.success('Бронь найдена');
        else
          message.warning('Бронь не найдена');
      })
      .then(() => this.setState({ tableLoading: false }))
  }

  render() {
    const {name, surname, patronym, tableLoading, data} = this.state;
    const columns = [
      {
        title: "Номер",
        dataIndex: "number",
        key: "number",
      },
      {
        title: "Кол-во персон",
        dataIndex: "persons",
        key: "persons",
      },
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
        title: "Цена за номер",
        dataIndex: "number_price",
        key: "number_price",
        render: val => val + " р.",
      },
      {
        title: "Цена за услуги",
        dataIndex: "service_price",
        key: "service_price",
        render: val => val + " р.",
      },
      {
        title: "Стоимость проживания",
        dataIndex: "total",
        key: "total",
        render: val => val + " р.",
      },
    ];

    return (
      <div style={{margin: 16, width: '100%'}}>
        <Input
          onChange = {({ target: { value } }) => {
            this.setState({ surname: value });
          }}
          placeholder="Фамилия"
          style={{ width: 200, marginRight: 10 }}
        />
        <Input
          onChange = {({ target: { value } }) => {
            this.setState({ name: value });
          }}
          placeholder="Имя"
          style={{ width: 200, marginRight: 10 }}
        />
        <Input
          onChange = {({ target: { value } }) => {
            this.setState({ patronym: value });
          }}
          placeholder="Отчество"
          style={{ width: 200, marginRight: 10 }}
        />
        <Button
          loading={tableLoading}
          type="primary"
          onClick={() => {
            if (name && surname && patronym) {
              this.setState({tableLoading: true})
              this.checkPerson(name, surname, patronym);
            }
            else {
              message.warning('Заполните все поля!');
            }
          }}
        >
          Проверить
        </Button>
        <Table
          style={{marginTop: 16, flex: 1}}
          columns={columns}
          dataSource={data}
          pagination={false}
          size={"small"}
          tableLayout={"auto"}
          bordered={true}
          loading={tableLoading}
        />
      </div>
    );
  }
}

export default Check;