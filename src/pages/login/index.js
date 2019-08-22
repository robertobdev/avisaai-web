import React, { useState, useEffect } from 'react'
import { Form, Icon, Input, Button } from 'antd';
import Parse from 'parse';
import './login.css';

const LoginPage = (props) => {
  const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = props.form;

  // Only show error after a field is touched.
  const usernameError = isFieldTouched('username') && getFieldError('username');
  const passwordError = isFieldTouched('password') && getFieldError('password');

  const hasErrors = (fieldsError) => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  // const [username, setUsername] = useState('');
  // const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const {username, password } = props.form.getFieldsValue(["username", "password"]);
    Parse.User.logIn(username, password).then((user) => {
      // Do stuff after successful login
      if (typeof document !== 'undefined') document.write(`Logged in user: ${JSON.stringify(user)}`);
      console.log('Logged in user', user);
    }).catch(error => {
      if (typeof document !== 'undefined') document.write(`Error while logging in user: ${JSON.stringify(error)}`);
      console.error('Error while logging in user', error);
    });
  }

  return (
    <Form layout="vertical" className="Login-container" onSubmit={handleSubmit}>
      <Form.Item validateStatus={usernameError ? 'error' : ''} help={usernameError || ''}>
        {getFieldDecorator('username', {
          rules: [{ required: true, message: 'Please input your username!' }],
        })(
          <Input
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Username" 
          />,
        )}
      </Form.Item>
      <Form.Item validateStatus={passwordError ? 'error' : ''} help={passwordError || ''}>
        {getFieldDecorator('password', {
          rules: [{ required: true, message: 'Please input your Password!' }],
        })(
          <Input
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="password"
            placeholder="Password"
          />,
        )}
      </Form.Item>
      <Form.Item>
        <Button className="Login-button" type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
          Log in
        </Button>
      </Form.Item>
    </Form>
  );
}

export default Form.create({ name: 'horizontal_login' })(LoginPage);