import React, { useState } from "react";
import { ModalForm } from "@ant-design/pro-form";
import { Form } from "antd";
import type { FormLayout } from "antd/lib/form/Form";
import type { Rule } from "antd/lib/form";
import ReactDOM from "react-dom";
import { LAYOUT_TYPE_HORIZONTAL } from "@/contants/contants";
export type Field = {
  name: string;
  label: string;
  required?: boolean;
  rules?: Rule[];
  formItemProp?: Record<string, any>;
  getComponents: () => React.ReactNode;
};
export interface IProps<T> {
  initialValues?: Record<string, any>;
  onSubmit: (val: T) => Promise<boolean>;
  title: string | React.ReactNode;
  field: Field[] | null;
  layout?: FormLayout;
  className?: string;
  children?: JSX.Element | undefined;
  width?: number;
  trigger?: JSX.Element | undefined;
  onCancel?: () => void;
  //提交时是否提交所有值，包括表单没有但初始值有的属性值，true提交所有值，false只提交表单属性值
  submitAll?: boolean;
  [key: string]: any;
}
export default function ProFormModal<T = Record<string, any>>(
  props: IProps<T>,
) {
  const {
    initialValues = {},
    onSubmit,
    title,
    field,
    layout = LAYOUT_TYPE_HORIZONTAL,
    className,
    width = 600,
    trigger,
    visible = undefined,
    onCancel,
    submitAll = false,
    ...rest
  } = props;
  const formItemLayout = {
    labelCol: { span: 4 },
  };
  const [visibleModal, setVisibleModal] = useState<boolean | undefined>(
    visible,
  );
  const [submitting, setSubmitting] = useState(false);
  const onFinish = async (values: any) => {
    const data = submitAll ? { ...initialValues, ...values } : values;
    try {
      setSubmitting(true);
      const visible = await onSubmit(data);
      setSubmitting(false);
      return visible;
    } catch (error: any) {
      setSubmitting(false);
      return false;
    }
  };
  return (
    <ModalForm<T>
      {...rest}
      title={title}
      layout={layout}
      initialValues={initialValues}
      onVisibleChange={setVisibleModal}
      width={width}
      visible={trigger ? undefined : visibleModal}
      trigger={trigger}
      modalProps={{
        destroyOnClose: true,
        onCancel,
      }}
      submitter={{
        submitButtonProps: { loading: submitting },
        ...(rest.submitter || {}),
      }}
      onFinish={onFinish}
    >
      {field
        ? field?.map((item, index) => {
            const rules = item.rules || [];
            if (item.required) {
              rules.push({
                required: true,
                message: `${item.label}不能为空`,
              });
            }
            return (
              <Form.Item
                {...formItemLayout}
                {...(item?.formItemProp || {})}
                key={index}
                required={item.required}
                name={item.name}
                label={item.label}
                rules={rules}
              >
                {item.getComponents()}
              </Form.Item>
            );
          })
        : props.children}
    </ModalForm>
  );
}
ProFormModal.open = (props: IProps<Record<string, any>>) => {
  const el = document.createElement("div");
  ReactDOM.render(<ProFormModal {...props} visible={true} />, el);
};
