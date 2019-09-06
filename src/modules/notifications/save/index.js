import Parse from 'parse';
import React, { useState, useEffect } from 'react';
import './save.css';
import { Form, Input, Button, Select, message, PageHeader } from 'antd';
const { TextArea } = Input;
const { Option } = Select;

const NotificationAddPage = (props) => {
  const Notifications = Parse.Object.extend('Notification');
  const query = new Parse.Query(Notifications);
  const News = Parse.Object.extend('News');
  const queryNews = new Parse.Query(News);
  //TODO: remove this;
  const { match } = props.props;
  const [notification, setNotification] = useState(new Notifications());
  const [error, setError] = useState(false);
  const [newsType, setNewsType] = useState();
  const [news, setNews] = useState([]);
  useEffect(() => {
    queryNews.find().then(news => {
      setNews(news);
    });
    if (Object.keys(match.params) !== '') {
      query.get(match.params.id).then(result => {
        if (result) {
          const { attributes } = result;
          console.log(result);
          setNotification(result);
          let form = props.form;
          form.setFields({
            title: {
              value: attributes.title,
            },
            description: {
              value: attributes.description,
            }
          });
          const newsRelation = result.relation("news_relation");

          newsRelation.query().first().then((news) => {
            setNewsType(news.id);
          });

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

  const hasErrors = (fieldsError) => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { title, description } = props.form.getFieldsValue(["title", "description"]);
    notification.set('title', title);
    notification.set('description', description);

    let relation = notification.relation("news_relation");
    console.log(newsType);
    await queryNews.get(newsType).then(newsData => {
      relation.add(newsData);      
    });
    setTimeout(() => {
      notification.save().then(
        (result) => {
          message.success('Notificação salva!', 2).then(() => {
            props.props.history.push('/panel/notifications');
          });
        },
        (error) => {
          setError(true);
          setTimeout(() => {
            setError(false);
          }, 4000);
          console.error('Error while creating or update Notification: ', error);
        }
      );
    }, 1100);
  }
  const routes = [
    {
      path: '',
      breadcrumbName: 'Notificações',
    },
    {
      path: '',
      breadcrumbName: 'Adicionar Notificação',
    },
  ];


  return (
    <>
      <PageHeader title="" breadcrumb={{ routes }} />
      <Form layout="vertical" className="MarkerSave-container" onSubmit={handleSubmit}>
        <Form.Item validateStatus={titleError ? 'error' : ''} help={titleError || ''}>
          {getFieldDecorator('title', {
            rules: [{ required: true, message: 'Por favor coloque o título.' }],
          })(
            <Input
              placeholder="Título"
            />,
          )}
        </Form.Item>
        <Form.Item validateStatus={descriptionError ? 'error' : ''} help={descriptionError || ''}>
          {getFieldDecorator('description', {
            rules: [{ required: true, message: 'Por favor coloque a descrição.' }],
          })(
            <TextArea
              placeholder="Descrição"
              autosize={{ minRows: 3, maxRows: 10 }}
            />,
          )}
        </Form.Item>

        <Form.Item>
          <Select value={newsType} style={{ width: '100%' }} onChange={(news) => setNewsType(news)}>
            {news.map(({ id, attributes }) => {
              return <Option value={id} key={id}>{attributes.description}</Option>;
            })}
          </Select>
        </Form.Item>
        {error ? <div className="NewsSave-error">Error ao cadastrar notificação</div> : ''}
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
            Salvar
        </Button>
        </Form.Item>
      </Form>
    </>
  )
};

export default Form.create({ name: 'horizontal_login' })(NotificationAddPage);