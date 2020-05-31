import React  from "react";
import {
  DatePicker,
  Button,
  Table,
  Space,
  Tag,
  message, Select, Input
} from "antd";
import Service from "../components/Service";
import moment from "moment"

import "../App.css";

const { RangePicker } = DatePicker;
const { Option } = Select

class Create extends React.Component {
  state = {
    data: null,
    name: null,
    surname: null,
    patronym: null,
    passport: null,
    capacity: null,
    apClass: null,
    loading: false,
    apartments: null,
    dates: null,
    services: null,
    selected: null,
    calendarValue: null,
    capacities: null,
    classes: null
  }

  componentDidMount() {
    fetch("/classes")
      .then((raw) => raw.json())
      .then((obj) => this.setState({classes: obj.data}))
      .then(() => {
        fetch("/capacities")
          .then((raw) => raw.json())
          .then((obj) => this.setState({capacities: obj.data}))
      })
  }

  emptyWithParams = () => {
    if (this.state.dates) {
      fetch(`/empty/${this.state.dates[0]}/${this.state.dates[1]}/${this.state.capacity}/${this.state.apClass}`)
        .then((raw) => raw.json())
        .then((obj) =>
          obj.data.map((el, index) => ({ ...el, key: index + 1 }))
        )
        .then((data) => this.setState({data: data}))
        .then(() => this.setState({loading: false}))
    }
  }

  render() {
    const columns = [
      {
        title: "Номер",
        dataIndex: "number",
        key: "number",
        ellipsis: true,
      },
      {
        title: "Вместимость",
        dataIndex: "capacity",
        key: "capacity",
        ellipsis: true,
      },
      {
        title: "Класс",
        dataIndex: "class",
        key: "class",
        ellipsis: true,
      },
      {
        title: "Цена за день",
        dataIndex: "day_price",
        key: "day_price",
        ellipsis: true,
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
        ellipsis: true,
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
        ellipsis: true,
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
        ellipsis: true,
      },
    ];
    
    const {data, name, surname, patronym, passport, capacity, loading, apartments,
           dates, services, selected, calendarValue, capacities, classes} = this.state;
    
    return (
      <div className="create-window">
        <div style={{ width: 600, marginTop: 10 }}>
          <h4>Фамилия клиента</h4>
          <Input
            value={surname}
            onChange={({ target }) => {
              this.setState({surname: target.value});
            }}
            placeholder={"Иванов"}
          />
        </div>

        <div style={{ width: 600, marginTop: 10 }}>
          <h4>Имя клиента</h4>
          <Input
            disabled={!surname}
            value={name}
            onChange={({ target }) => {
              this.setState({name: target.value});
            }}
            placeholder={"Иван"}
          />
        </div>


        <div style={{ width: 600, marginTop: 10 }}>
          <h4>Отчество клиента</h4>
          <Input
            disabled={!name}
            value={patronym}
            onChange={({ target }) => {
              this.setState({patronym: target.value});
            }}
            placeholder={"Иванович"}
          />
        </div>


        <div style={{ width: 600, marginTop: 10 }}>
          <h4>Паспорт клиента</h4>
          <Input
            disabled={!patronym}
            value={passport}
            onChange={({ target }) => {
              this.setState({passport: target.value});
            }}
            placeholder={"9999 999999"}
          />
        </div>

        <div style={{width: 600, display: "flex", alignItems: "center", justifyContent: "space-between"}}>
          <div>
            <h4 style={{marginTop: 10}}>Даты проживания</h4>
            <RangePicker
              disabled={!passport}
              style={{width: 300}}
              value={calendarValue}
              format="YYYY-MM-DD"
              onChange={async (dates, dateStrings) => {
                await this.setState({loading: true});
                await this.setState({dates:[dateStrings[0], dateStrings[1]]});
                await this.setState({calendarValue: [moment(dateStrings[0]), moment(dateStrings[1])]})
                this.emptyWithParams()
              }}
            />
          </div>
          <div>
            <h4 style={{marginTop: 10}}>Число мест:</h4>
            {capacities ?
              <Select placeholder="Любое" disabled={!passport} style={{width: 100}} onChange={async (value) => {
                await this.setState({capacity: value})
                this.emptyWithParams()
              }}>
                <Option value={null}>Любое</Option>
                {capacities.map(el =>
                  <Option key={el.capacity} value={el.capacity}>{el.capacity}</Option>
                )}
              </Select>
              : <Select style={{width: 100}} loading={true} disabled/>}
          </div>
          <div>
            <h4 style={{marginTop: 10}}>Класс:</h4>
            {classes ?
              <Select placeholder="Любой" disabled={!passport} style={{width: 100}} onChange={async (value) => {
                await this.setState({apClass: value})
                this.emptyWithParams()
              }}>
                <Option value={null}>Любой</Option>
                {classes.map(el =>
                  <Option key={el.class} value={el.class}>{el.class}</Option>
                )}
              </Select>
              : <Select style={{width: 100}} loading={true} disabled/>}
          </div>
        </div>

        {data === null ? null : (
          <Space style={{marginLeft: 16, marginRight: 16, marginTop: 16}}>
            <Table
              rowSelection={{
                type: "radio",
                onChange: (selectedRowKeys, selectedRows) => {
                  this.setState({apartments: [selectedRowKeys[0] - 1, selectedRows[0].id]});
                  fetch("/services")
                    .then((raw) => raw.json())
                    .then((obj) => {
                      this.setState({services: obj.data})
                      this.setState({selected: new Array(obj.data.length).fill({state: false, num: 1, dates: []})})
                    })
                },
                getCheckboxProps: (record) => ({
                  disabled: record.name === "Disabled User", // Column configuration not to be checked
                  name: record.name,
                }),
              }}
              style={{width: 600}}
              columns={columns}
              dataSource={data}
              pagination={false}
              size={"small"}
              tableLayout={"Fixed"}
              bordered={true}
              loading={loading}
            />
          </Space>
        )}
        {services && selected ?
          <div style={{width: 600, marginTop: 10}}>
            <h4>Услуги</h4>
            {services.map((service, index) => {
              return (
                <Service
                  key={service.id}
                  text={service.name}
                  cb_disabled={!data}
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
                    } else return el;
                  })})}
                />
              )
            })}
          </div> : null
        }
        {dates && apartments && selected && services ? (
            <Button
              size={"large"}
              style={{marginTop: 10, width: 600}}
              type="primary"
              onClick={() => {
                let post_data = {
                  client: {
                    name,
                    surname,
                    patronym,
                    passport: Number(passport.replace(/\s/g, "")),
                  },
                  order: {
                    a_id: apartments[1],
                    persons: Number(capacity),
                    dates,
                  },
                  services: selected,
                };
                fetch("/create", {
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  method: "post",
                  body: JSON.stringify(post_data),
                })
                  .then((res) => {
                    if (res.status === 200) message.success('Заселение оформлено')
                    else message.error('Произошла ошибка');

                    this.setState({
                      data: null,
                      name: null,
                      surname: null,
                      patronym: null,
                      passport: null,
                      capacity: null,
                      apClass: null,
                      loading: false,
                      apartments: null,
                      dates: null,
                      services: null,
                      selected: null,
                      calendarValue: null,
                      capacities: null,
                      classes: null
                    })
                  })
              }}
            >
              {"Оформить"}
            </Button>
        ) : (
          <Space style={{marginTop: 10}}>
            <Button
              disabled={true}
              size={"large"}
              style={{marginTop: 10, width: 600}}
              type="primary"
            >
              Оформить
            </Button>
          </Space>
        )}
      </div>
    );
  }
}

export default Create;
