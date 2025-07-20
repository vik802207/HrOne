import React, { useState } from "react";
import { Input, Select, Button, Space } from "antd";
import { v4 as uuidv4 } from "uuid";

const { Option } = Select;

const defaultField = () => ({
  id: uuidv4(),
  name: "",
  type: "string",
  children: [],
});
function downloadJSON(data, filename = "schema.json") {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

function renderJSON(fields) {
  const obj = {};
  fields.forEach((field) => {
    if (!field.name) return;
    if (field.type === "nested") {
      obj[field.name] = renderJSON(field.children || []);
    } else {
      obj[field.name] = field.type === "string" ? "string" : 0;
    }
  });
  return obj;
}

const Field = ({ fields, setFields }) => {
  const updateField = (index, key, value) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
  };

  const handleAddField = () => {
    setFields([...fields, defaultField()]);
  };

  const handleRemove = (index) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  const updateNested = (index, children) => {
    const newFields = [...fields];
    newFields[index].children = children;
    setFields(newFields);
  };

  return (
    <div style={{ marginLeft: 16 }}>
      {fields.map((field, index) => (
        <div key={field.id} style={{ marginBottom: 10 }}>
          <Space>
            <Input
              placeholder="Key"
              value={field.name}
              onChange={(e) => updateField(index, "name", e.target.value)}
            />
            <Select
              value={field.type}
              style={{ width: 120 }}
              onChange={(val) => updateField(index, "type", val)}
            >
              <Option value="string">String</Option>
              <Option value="number">Number</Option>
              <Option value="nested">Nested</Option>
            </Select>
            <Button danger onClick={() => handleRemove(index)}>
              Delete
            </Button>
          </Space>

          {field.type === "nested" && (
            <Field
              fields={field.children || []}
              setFields={(childFields) => updateNested(index, childFields)}
            />
          )}
        </div>
      ))}

      <Button type="primary" onClick={handleAddField}>
        Add Field
      </Button>
    </div>
  );
};

export default function SchemaBuilder() {
  const [fields, setFields] = useState([defaultField()]);

  return (
    <div style={{ display: "flex", gap: 40, padding: 40 }}>
      <div style={{ flex: 1 }}>
        <h2>JSON Schema Builder</h2>
        <Field fields={fields} setFields={setFields} />
        <Button
          type="primary"
          style={{ marginTop: 20 }}
          onClick={() => downloadJSON(renderJSON(fields))}
        >
          Export as JSON
        </Button>
      </div>
      <div style={{ flex: 1 }}>
        <h2>Live JSON Preview</h2>
        <pre
          style={{
            backgroundColor: "#f5f5f5",
            padding: "16px",
            borderRadius: "6px",
          }}
        >
          {JSON.stringify(renderJSON(fields), null, 2)}
        </pre>
      </div>
    </div>
  );
}

