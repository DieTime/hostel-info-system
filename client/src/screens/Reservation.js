import React, {Component} from 'react';
import {Button, Table, Tag, Modal, Divider, Spin, Popconfirm, message} from "antd";

class Reservation extends Component {
  state = {
    data: null,
    tableLoading: true,
    s_dates: null,
    aboutNumber: null,
    visible: false,
  }

  componentDidMount() {
    this.updateTable()
  }

  updateTable = () => {
    fetch("/reservation")
      .then(raw => raw.json())
      .then(obj => this.setState({data: obj.data}))
      .then(() => this.setState({tableLoading: false}))
  }

  render() {
    const columns = [
      {
        title: "Номер",
        dataIndex: "number",
        key: "number",
      },
      {
        title: "Постояльцев",
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
        title: "Стоимость за номер",
        dataIndex: "number_price",
        key: "number_price",
        render: val => val + " р.",
      },
      {
        title: "Стоимость за услуги",
        dataIndex: "service_price",
        key: "service_price",
        render: val => val + " р.",
      },
      {
        title: "Итоговая стоимость",
        dataIndex: "total",
        key: "total",
        render: val => val + " р.",
      },
      {
        title: "Информация",
        key: "about",
        render: (record) => (
          <Button
            type="dashed"
            onClick={() => {
              fetch(`/info/${record.id}`)
                .then(raw => raw.json())
                .then(obj => {
                  let s_dates = {}
                  // eslint-disable-next-line array-callback-return
                  obj.data.map((el) => {
                    if (!s_dates.hasOwnProperty(el.name)) s_dates[el.name] = []
                    s_dates[el.name].push(el)
                  })
                  this.setState({s_dates: Object.entries(s_dates)})
                })
                .then(() => fetch(`/apartments/${record.number}`))
                .then((raw) => raw.json())
                .then((obj) => this.setState({aboutNumber: obj.data, visible: true}))
            }}
          >
            Подробнее
          </Button>
        ),
      },
      {
        title: 'Отмена брони',
        key: 'action',
        render: (text, record) =>
          <Popconfirm
            title="Вы уверены в отмене?"
            onConfirm={() => {
              fetch("/remove", {
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                method: "post",
                body: JSON.stringify(record),
              })
                .then((res) => {
                  if (res.status === 200) {
                    message.success('Бронь успешно отменена')
                  } else {
                    message.error('Произошла ошибка при отмене!');
                  }
                  this.setState({tableLoading: true})
                  this.updateTable()
                })
            }}
            okText="Да"
            cancelText="Нет"
            placement="bottomRight"
          >
            <Button
              type="primary"
            >
              Отменить
            </Button>
          </Popconfirm>
      }
    ];

    const service_columns = [
      {
        title: "Дата",
        dataIndex: "date",
        key: "date",
        render: value => new Date(value).toLocaleDateString()
      },
      {
        title: "Количество",
        dataIndex: "count",
        key: "count",
      },
      {
        title: "Цена услуги",
        dataIndex: "price",
        key: "price",
      },
      {
        title: "Итого",
        dataIndex: "total",
        key: "total",
      },
    ]

    const number_columns = [
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
    ];

    return (
      <div style={{width: "100%"}}>
        <Modal
          width={750}
          cancelText={"Закрыть"}
          title="Информация о брони"
          visible={this.state.visible}
          onOk={() => this.setState({visible: false})}
          onCancel={() => this.setState({visible: false})}
        >
          <Divider>О номере</Divider>
          <Table
            style={{flex: 1}}
            columns={number_columns}
            dataSource={this.state.aboutNumber}
            pagination={false}
            size={"small"}
            tableLayout={"auto"}
            bordered={true}
          />
          {this.state.s_dates ? this.state.s_dates.map((el) => (
            <div key={el[0]}>
              <Divider>{el[0]}</Divider>
              <Table
                style={{flex: 1}}
                columns={service_columns}
                dataSource={el[1]}
                pagination={false}
                size={"small"}
                tableLayout={"auto"}
                bordered={true}
              />
            </div>
          )) : <Spin size="large"/>}
        </Modal>
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
      </div>
    );
  }
}

export default Reservation;