import React, { useState } from 'react'
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

  const [error, setError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const { username, password } = props.form.getFieldsValue(["username", "password"]);
    Parse.User.logIn(username, password).then((user) => {
      localStorage.setItem("app_session_token", user.getSessionToken());
      console.log(props);
      props.history.push("/panel");
    }).catch(error => {
      console.log(error);
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 4000);
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
            placeholder="Usuário"
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
            placeholder="Senha"
          />,
        )}
      </Form.Item>
      {error ? <div className="Login-error">Usuário ou senha inválido!</div> : ''}
      <Form.Item>
        <Button className="Login-button" type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
          Entrar
        </Button>
      </Form.Item>
    </Form>
  );
}

export default Form.create({ name: 'horizontal_login' })(LoginPage);