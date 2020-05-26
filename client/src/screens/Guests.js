import React, {Component} from 'react';
import {Table, Button, Modal, Divider, Spin, Tag, message} from "antd";
import QRCode from "qrcode.react";

class Guests extends Component {
  state = {
    data: null,
    tableLoading: true,
    visible: false,
    infoRecord: null,
    sDates: null,
    aboutNumber: null,
    payRecord: null,
    payVisible: false,
    confirmLoading: false,
  }

  componentDidMount() {
    this.updateTable();
  }

  updateTable = () => {
    fetch("/guests")
      .then(raw => raw.json())
      .then(obj => this.setState({data: obj.data}))
      .then(() => this.setState({ tableLoading: false }))
  }

  render() {
    const {payRecord} = this.state
    const columns = [
      {
        title: "Номер",
        dataIndex: "number",
        key: "number",
      },
      {
        title: "Количество",
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
                  let sDates = {}
                  // eslint-disable-next-line array-callback-return
                  obj.data.map((el) => {
                    if (!sDates.hasOwnProperty(el.name)) sDates[el.name] = []
                    sDates[el.name].push(el)
                  })
                  this.setState({sDates: Object.entries(sDates)})
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
        title: 'Счет на оплату',
        key: 'action',
        render: (text, record) => {
          if (record.end_date <= new Date().toISOString().slice(0, 10)) {
            return (
              <Button
                type="primary"
                onClick={() => {
                  this.setState({payRecord: record, payVisible: true})
                }}
              >
                Выставить
              </Button>
            )
          }
          else return <Button disabled>Выставить</Button>
        }
      },
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
          cancelText={"Закрыть"}
          title="Счет на оплату"
          visible={this.state.payVisible}
          okText="Оплата"
          confirmLoading={this.state.confirmLoading}
          onOk={() => {
            this.setState({confirmLoading: true})
            setTimeout(() => {
              this.setState({confirmLoading: false})
              fetch("/remove", {
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                method: "post",
                body: JSON.stringify(payRecord),
              })
                .then((res) => {
                  setTimeout(() => {
                    this.setState({payVisible: false})
                    if (res.status === 200) {
                      message.success('Оплата прошла успешно')
                    } else {
                      message.error('Произошла ошибка оплаты!');
                    }
                    this.setState({ tableLoading: true })
                    this.updateTable()
                  }, 500)

                })
            }, 1000)
          }}
          onCancel={() => this.setState({payVisible: false})}
        >{payRecord ? (
          <div style={{display: "flex", justifyContent: "space-between"}}>
            <div>
              <h2 style={{marginBottom: 10}}>{payRecord.surname + " " + payRecord.name + " " + payRecord.patronym}</h2>
              <div style={{display: "flex", alignItems: "center"}}>
                <p style={{fontSize: 16, margin: 0, marginRight: 10}}>К оплате за номер:</p>
                <h3 style={{margin: 0}}>{payRecord.number_price + " р."}</h3>
              </div>
              <div style={{display: "flex", alignItems: "center"}}>
                <p style={{fontSize: 16, margin: 0, marginRight: 10}}>К оплате за услуги:</p>
                <h3 style={{margin: 0}}>{payRecord.service_price + " р."}</h3>
              </div>
              <div style={{display: "flex", alignItems: "center", marginTop: 7}}>
                <p style={{fontSize: 16, margin: 0, marginRight: 10}}>Итого к оплате:</p>
                <h2 style={{margin: 0}}>{payRecord.total + " р."}</h2>
              </div>
            </div>
            <div>
              <QRCode renderAs="svg" size={135} value={JSON.stringify(payRecord)}/>
            </div>
          </div>
          ): null}
        </Modal>
        <Modal
          width={750}
          cancelText={"Закрыть"}
          title="Информация о заселении"
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
          {this.state.sDates ? this.state.sDates.map((el) => (
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
          )) : <Spin size="large" />}
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

export default Guests;