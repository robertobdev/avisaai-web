import Parse from 'parse';
import React, { useState, useEffect } from 'react';
import './news.css';
import { Form, Icon, Input, Button, Upload, message } from 'antd';
const { TextArea } = Input;

const NewsAddPage = (props) => {
  const News = Parse.Object.extend('News');
  const query = new Parse.Query(News);
  //TODO: remove this;
  const { match } = props.props;
  const [news, setNews] = useState(new News());
  useEffect(() => {
    if (Object.keys(match.params) != '') {
      query.get(match.params.id).then(result => {
        if (result) {
          const { attributes } = result;
          setNews(result);
          let form = props.form;
          form.setFields({
            title: {
              value: attributes.title,
            },
            description: {
              value: attributes.description,
            }
          });
          setImageUrl(attributes.image._url);
        }
      }).catch(() => {
        console.error('error');
      });
    }
  }, []);

  const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = props.form;

  // Only show error after a field is touched.
  const titleError = isFieldTouched('title') && getFieldError('title');
  const descriptionError = isFieldTouched('description') && getFieldError('description');
  const imageError = isFieldTouched('image') && getFieldError('image');

  const hasErrors = (fieldsError) => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  const [error, setError] = useState(false);

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(false);

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => {
        setImageUrl(imageUrl);
        setLoading(false);
      });
    }
  }


  const handleSubmit = async (event) => {
    event.preventDefault();
    const { title, description } = props.form.getFieldsValue(["title", "description"]);
    if (!imageUrl.includes('http')) {
      news.set('image', new Parse.File((Math.random() * 1000).toString().replace('.', '') + `.png`, { base64: imageUrl }));
    }
    news.set('title', title);
    news.set('description', description);
    news.save().then(
      (result) => {
        message.success('Notícia salva.', 2).then(() => {
          props.props.history.push('/panel/news');
        });
      },
      (error) => {
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 4000);
        console.error('Error while creating or update News: ', error);
      }
    );
  }

  const uploadButton = (
    <div>
      <Icon type={loading ? 'loading' : 'plus'} />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  return (
    <Form layout="vertical" className="Login-container" onSubmit={handleSubmit}>
      <Form.Item validateStatus={titleError ? 'error' : ''} help={titleError || ''}>
        {getFieldDecorator('title', {
          rules: [{ required: true, message: 'Por favor coloque o título da notícia.' }],
        })(
          <Input
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Título"
          />,
        )}
      </Form.Item>
      <Form.Item validateStatus={descriptionError ? 'error' : ''} help={descriptionError || ''}>
        {getFieldDecorator('description', {
          rules: [{ required: true, message: 'Por favor coloque a descrição da notícia.' }],
        })(
          <TextArea
            placeholder="Descrição"
            autosize={{ minRows: 3, maxRows: 10 }}
          />,
        )}
      </Form.Item>
      <Form.Item validateStatus={imageError ? 'error' : ''} help={imageError || ''}>
        {getFieldDecorator('image', {
          rules: [{ required: true, message: 'Por favor coloque a descrição da notícia.' }],
        })(
          <>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
            </Upload>
          </>
        )}
      </Form.Item>
      {error ? <div className="NewsSave-error">Error ao cadastrar notícia</div> : ''}
      <Form.Item>
        <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
          Salvar
        </Button>
      </Form.Item>
    </Form>
  )
};

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}


export default Form.create({ name: 'horizontal_login' })(NewsAddPage);;