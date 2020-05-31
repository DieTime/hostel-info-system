import React, {Component, } from 'react';
import {Button, message, Select, Table} from "antd";
import Service from "../components/Service";
import "../App.css";

const { Option } = Select;

class AddServices extends Component {
  state = {
    services: null,
    selected: null,
    orders: [],
    order_id: null,
    order_client: null,
    loading: true,
  }

  componentDidMount() {
    fetch("/services")
      .then((raw) => raw.json())
      .then((obj) => {
        this.setState({services: obj.data})
        this.setState({selected: new Array(obj.data.length).fill({state: false, num: 1, dates: []})})
      })
      .then(() => fetch('/guests'))
      .then(raw => raw.json())
      .then(obj => {
        this.setState({orders: obj.data})
        this.setState({loading: false})
      })
  }

  render() {
    const {services, selected} = this.state
    const columns = [
      {
        title: "Кол-во персон",
        dataIndex: "persons",
        key: "persons",
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
      }
    ]

    return (
      <div style={{flex: 1, display: "flex", justifyContent: "center", flexDirection: "row", paddingTop: 20}}>
        <div style={{width: 600}}>
        <div>
        <h4 style={{marginBottom: 5, textAlign: "left"}}>
          Введите ФИО клиента
        </h4>
        <Select
          value={this.state.order_client}
          showSearch
          disabled={this.state.loading}
          style={{ width: 600, marginBottom: 5 }}
          placeholder="Иванов Иван Иванович"
          optionFilterProp="children"
          onChange={(value, option) => {
            this.setState({
              order_id: Number(option.key),
              order_client: option.value
            })
          }}
          filterOption={(input, option) => {
            return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }}
        >
          {this.state.orders.map(el => {
            return (
              <Option key={el.id} value={el.surname + " " + el.name + " " + el.patronym}>
                <div style={{display: "flex", height: 20, justifyContent: "space-between"}}>
                  <p>{el.surname + " " + el.name + " " + el.patronym}</p>
                  <p>{"Апартаменты №" + el.number}</p>
                </div>
              </Option>
            )
          })}
        </Select>
        </div>
        {this.state.order_id ?
          <Table
            style={{paddingTop: 10, paddingBottom: 5, flex: 1, width: 600}}
            columns={columns}
            dataSource={this.state.orders.filter((el) => el.id === this.state.order_id)}
            pagination={false}
            size={"small"}
            tableLayout={"auto"}
            bordered={true}
          />
          : null
        }
        <div>
          {this.state.order_id && services && selected ?
            <div style={{width: 600, marginTop: 10}}>
              {services.map((service, index) => {
                return (
                  <Service
                    cb_disabled={!this.state.order_id}
                    key={service.id}
                    text={service.name}
                    checkState={selected[index].state}
                    number={selected[index].num}
                    onCheck={(value) => this.setState({selected: selected.slice().map((el, i) => {
                      if (i === index) return {...el, state: value};
                      else return el;
                    })})}
                    onNumberChange={(number) => this.setState({selected: selected.slice().map((el, i) => {
                      if (i === index) return {...el, num: number};
                      else return el;
                    })})}
                    setDates={(arr) => this.setState({selected: selected.slice().map((el, i) => {
                      if (i === index) {
                        if (arr[0] === "" || arr[1] === "") return {...el, dates: []}
                        else return {...el, dates: arr};
                      }
                      else return el;
                    })})}
                  />
                )
              })}
            </div> : null
          }
        </div>
        {this.state.order_id ?
          <Button
            size={"large"}
            style={{ marginTop: 15, width: 600 }}
            type="primary"
            onClick={() => {
              console.log(this.state)
              let post_data = {
                order_id: this.state.order_id,
                services: selected,
              };
              fetch("/add/services", {
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                method: "post",
                body: JSON.stringify(post_data),
              })
                .then((res) => {
                  if (res.status === 200) message.success('Услуги успешно добавлены')
                  else message.error('Произошла ошибка добваления');

                  this.setState({
                    services: null,
                    selected: null,
                    order_id: null,
                    order_client: null,
                  })
                })
            }}
          >
            Добавить
          </Button>
          : null
        }
        </div>
      </div>
    );
  }
}

export default AddServices;