import React, { Component } from "react";
import { Menu } from "antd";
import {
  PlusSquareOutlined,
  AlignLeftOutlined,
  BookOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  AppstoreOutlined,
  CheckSquareOutlined,
  AppstoreAddOutlined
} from "@ant-design/icons";

class Header extends Component {
  state = {collapsed: true}

  render() {
    return (
      <div>
        <Menu
          onMouseEnter={() => {
            setTimeout(() => {
              this.setState({collapsed: false})
            }, 200)
          }}
          onMouseLeave={() => {
            setTimeout(() => {
              this.setState({collapsed: true})
            }, 300)
          }}
          inlineCollapsed={this.state.collapsed}
          onClick={this.props.onClick}
          selectedKeys={[this.props.selected]}
          mode="inline"
        >
          <Menu.Item key="guests" icon={<TeamOutlined />}>
            Список постояльцев
          </Menu.Item>
          <Menu.Item key="reservation" icon={<ClockCircleOutlined />}>
            Забронированные номера
          </Menu.Item>
          <Menu.Item key="empty" icon={<AlignLeftOutlined />}>
            Свободные номера
          </Menu.Item>
          <Menu.Item key="today-tomorrow" icon={<AppstoreOutlined />}>
            Освобождающиеся номера
          </Menu.Item>
          <Menu.Item key="create" icon={<PlusSquareOutlined />}>
            Новое заселение
          </Menu.Item>
          <Menu.Item key="add-services" icon={<AppstoreAddOutlined />}>
            Добавление услуг
          </Menu.Item>
          <Menu.Item key="check" icon={<CheckSquareOutlined />}>
            Проверка брони
          </Menu.Item>
          <Menu.Item key="archive" icon={<BookOutlined />}>
            Архив
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

export default Header;
