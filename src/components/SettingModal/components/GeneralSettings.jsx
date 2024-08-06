import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { BACKEND_URI } from '~/API';

const GeneralSettings = () => {
  const [form] = Form.useForm();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post(`${BACKEND_URI}/user/get-user-data-by-user-id`, {
          user_id: currentUser.user_id,
        });
        form.setFieldsValue(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        message.error('Failed to load user data');
      }
    };

    fetchUserData();
  }, []);

  const onFinish = async (values) => {
    try {
      await axios.post(`${BACKEND_URI}/user/update-profile`, {
        user_id: currentUser.user_id,
        ...values,
      });
      message.success('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      message.error('Failed to update profile');
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item name="username" label="Username">
        <Input />
      </Form.Item>
      <Form.Item name="email" label="Email">
        <Input />
      </Form.Item>
      <Form.Item name="phone" label="Phone">
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Update Profile
        </Button>
      </Form.Item>
    </Form>
  );
};

export default GeneralSettings;