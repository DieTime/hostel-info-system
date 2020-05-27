import React from "react";
import { Checkbox, DatePicker, InputNumber } from "antd";
import "../App.css";

const { RangePicker } = DatePicker;

function Service({ text, cb_disabled, checkState, onCheck, number, onNumberChange, setDates }) {
  return (
    <div className="service">
      <Checkbox
        style={{ width: 85 }}
        disabled={cb_disabled}
        checked={checkState}
        onChange={(e) =>
          onCheck(e.target.checked)
        }
      >
        {text}
      </Checkbox>
      <InputNumber
        value={number}
        min={1}
        disabled={!checkState}
        onChange={(number) => {
          onNumberChange(number);
        }}
      />
      <RangePicker
        style={{ width: 250 }}
        format="YYYY-MM-DD"
        disabled={!checkState}
        onChange={(dates, dateStrings) => {
          setDates([dateStrings[0], dateStrings[1]]);
        }}
      />
    </div>
  );
}

export default Service;
