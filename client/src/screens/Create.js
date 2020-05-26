import React, { useState } from "react";
import {
  DatePicker,
  Button,
  Table,
  Space,
  Tag,
  message
} from "antd";
import TextInput from "../components/TextInput";
import Service from "../components/Service";
import "../App.css";

const { RangePicker } = DatePicker;

function Create() {
  const [data, setData] = useState(null);
  const [name, setName] = useState(null);
  const [surname, setSurname] = useState(null);
  const [patronym, setPatronum] = useState(null);
  const [passport, setPassport] = useState(null);
  const [capacity, setCapacity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apartments, setApartments] = useState(null);
  const [dates, setDates] = useState(null);
  const [services, setServices] = useState(null);
  const [selected, setSelected] = useState(null);


  const calculate = () => {
    let sum = 0;
    if (data && apartments && services && selected) {
      sum +=
        data[apartments[0]].day_price *
        Math.ceil(
          (new Date(dates[1]) - new Date(dates[0])) / (1000 * 60 * 60 * 24)
        );
      // eslint-disable-next-line array-callback-return
      selected.map((element, index) => {
        if (element.state && element.dates.length > 0)
          sum +=
            services[index].price *
            Math.ceil(
              (new Date(element.dates[1]) - new Date(element.dates[0])) /
                (1000 * 60 * 60 * 24)
            );
      });
      return sum;
    } else return 0;
  };

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

  return (
    <div className="create-window">
      <TextInput
        value={name}
        change={setName}
        placeholder={"Иван"}
        text={"Имя клиента"}
      />

      <TextInput
        disabled={!name}
        value={surname}
        change={setSurname}
        placeholder={"Иванов"}
        text={"Фамилия клиента"}
      />

      <TextInput
        disabled={!surname}
        value={patronym}
        change={setPatronum}
        placeholder={"Иванович"}
        text={"Отчество клиента"}
      />

      <TextInput
        disabled={!patronym}
        value={passport}
        change={setPassport}
        placeholder={"9999 999999"}
        text={"Паспорт клиента"}
      />

      <TextInput
        disabled={!passport}
        value={capacity}
        change={setCapacity}
        placeholder={"1"}
        text={"Количество человек"}
      />

      <div style={{ width: 600, marginTop: 10 }}>
        <h4>Даты проживания</h4>
        <RangePicker
          disabled={!(name && surname && patronym && capacity && passport)}
          style={{ width: 600 }}
          format="YYYY-MM-DD"
          onChange={(dates, dateStrings) => {
            setLoading(true);
            setDates([dateStrings[0], dateStrings[1]]);
            fetch(`/empty/${dateStrings[0]}/${dateStrings[1]}/${capacity}`)
              .then((raw) => raw.json())
              .then((obj) =>
                obj.data.map((el, index) => ({ ...el, key: index + 1 }))
              )
              .then((data) => setData(data))
              .then(() => setLoading(false));
          }}
        />
      </div>

      {data === null ? null : (
        <Space style={{ marginLeft: 16, marginRight: 16, marginTop: 16 }}>
          <Table
            rowSelection={{
              type: "radio",
              onChange: (selectedRowKeys, selectedRows) => {
                setApartments([selectedRowKeys[0] - 1, selectedRows[0].id]);
                fetch("/services")
                  .then((raw) => raw.json())
                  .then((obj) => {
                    setServices(obj.data)
                    setSelected(new Array(obj.data.length).fill({state: false, num: 1, dates: []}))
                  })
              },
              getCheckboxProps: (record) => ({
                disabled: record.name === "Disabled User", // Column configuration not to be checked
                name: record.name,
              }),
            }}
            style={{ width: 600 }}
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
                onCheck={(value) => setSelected(selected.slice().map((el, i) => {
                  if (i === index) return {...el, state: value};
                  else return el;
                }))}
                onNumberChange={(number) => setSelected(selected.slice().map((el, i) => {
                  if (i === index) return {...el, num: number};
                  else return el;
                }))}
                setDates={(arr) => setSelected(selected.slice().map((el, i) => {
                  if (i === index) {
                    if (arr[0] === "" || arr[1] === "") return {...el, dates: []}
                    else return {...el, dates: arr};
                  }
                  else return el;
                }))}
              />
            )
          })}
        </div> : null
      }
      {dates && apartments && selected && services ? (
        <Button
          size={"large"}
          style={{ marginTop: 10, width: 600 }}
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
                if (res.status === 200) {
                  message.success('Заселение оформлено')
                } else {
                  message.error('Произошла ошибка');
                }
              })
          }}
        >
          {"Оформить за " + calculate().toString() + " руб."}
        </Button>
      ) : (
        <Space style={{marginTop: 10}}>
        <Button
          disabled={true}
          size={"large"}
          style={{ marginTop: 10, width: 600 }}
          type="primary"
        >
          Оформить
        </Button>
        </Space>
      )}
    </div>
  );
}

export default Create;
