import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Button, Form, Input, message } from 'antd';

export const JSONSchemaForm = ({
  data,
  schema,
  showLoading = false,
  layout,
  submitText,
  onSubmit,
}) => {
  const form = useRef(null);
  const [loading, setLoading] = useState(false);

  const onFinish = useCallback(
    (values) => {
      setLoading(true);
      onSubmit(values)
        .then(() => {
          message.success('提交成功');
        })
        .catch((e) => {
          message.error('提交失败：', e.message || e);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [onSubmit]
  );

  /* eslint-disable prefer-const */
  let { title = '', required = [], properties = null } = schema;
  if (!properties) {
    properties = Object.keys(typeof data === 'object' ? data : {}).reduce((a, c) => {
      a[c] = {
        type: typeof data[c],
        key: c,
        title: c,
      };
      return a;
    }, {});
    schema.properties = properties;
  }

  useEffect(() => {
    if (!form.current) {
      return;
    }

    if (typeof data !== 'object') {
      form.current.resetFields();
    } else {
      form.current.setFieldsValue(data);
    }
  }, [data]);

  return (
    <div
      style={{
        padding: 16,
        background: '#fff',
        boxShadow: '0 0 16px rgba(0,0,0,.03)',
        border: '1px solid #ddd',
      }}
    >
      <h1>{title}</h1>
      <Form name="basic" layout={layout} ref={form} onFinish={onFinish}>
        {Object.keys(properties).map((key) => {
          const property = properties[key];
          return (
            <Form.Item
              fieldKey={key}
              key={key}
              name={key}
              label={property.title}
              hidden={property.hidden}
              rules={[{ required: required.includes(key), message: '请输入' }]}
            >
              <Input />
            </Form.Item>
          );
        })}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={showLoading && loading}>
            {submitText}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

JSONSchemaForm.componentInfo = {
  name: 'JSONSchemaForm',
};

JSONSchemaForm.defaultProps = {
  schema: {
    title: 'A registration form',
    description: 'A simple form example.',
    type: 'object',
    required: [],
    properties: {},
  },
  data: '',
  onSubmit: '',
  submitText: '提交',
  showLoading: true,
  layout: 'horizontal',
};

JSONSchemaForm.schema = {
  schema: {
    title: 'Schema',
    type: 'json',
  },
  data: {
    title: '数据',
    type: 'text',
  },
  onSubmit: {
    title: '提交事件',
    type: 'text',
  },
  submitText: {
    title: '提交文字',
    type: 'text',
  },
  showLoading: {
    title: '提交时加载',
    type: 'switch',
  },
  layout: {
    title: '文本对齐',
    type: 'select',
    options: ['horizontal', 'vertical', 'inline'],
  },
};