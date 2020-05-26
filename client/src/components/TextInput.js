import React from "react";
import { Input } from "antd";

function TextInput({ text, disabled, placeholder, value, change }) {
  return (
    <div style={{ width: 600, marginTop: 10 }}>
      <h4>{text}</h4>
      <Input
        disabled={disabled}
        value={value}
        onChange={({ target }) => {
          change(target.value);
        }}
        placeholder={placeholder}
      />
    </div>
  );
}

export default TextInput;
