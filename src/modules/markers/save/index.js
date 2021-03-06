import Parse from 'parse';
import React, { useState, useEffect } from 'react';
import './save.css';
import { Form, Input, Button, Select, message, PageHeader } from 'antd';
const { TextArea } = Input;
const { Option } = Select;

const MarkerAddPage = (props) => {
  const Markers = Parse.Object.extend('Markers');
  const query = new Parse.Query(Markers);
  const TypeMarkers = Parse.Object.extend('TypeMakers');
  const queryType = new Parse.Query(TypeMarkers);
  //TODO: remove this;
  const { match } = props.props;
  const [marker, setMarker] = useState(new Markers());
  const [error, setError] = useState(false);
  const [type, setType] = useState();
  const [types, setTypes] = useState([]);
  useEffect(() => {
    queryType.find().then(types => {
      setTypes(types);
    });
    if (Object.keys(match.params) !== '') {
      query.get(match.params.id).then(result => {
        if (result) {
          const { attributes } = result;
          console.log(result);
          setMarker(result);
          let form = props.form;
          form.setFields({
            title: {
              value: attributes.title,
            },
            description: {
              value: attributes.description,
            },
            latitude: {
              value: attributes.latitude,
            },
            longitude: {
              value: attributes.longitude,
            },
            place: {
              value: attributes.place,
            },
            radius: {
              value: attributes.radius,
            }
          });
          const type = result.relation("type_relation");

          type.query().first().then((type) => {
            setType(type.id);
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
  const placeError = isFieldTouched('place') && getFieldError('place');
  const longitudeError = isFieldTouched('longitude') && getFieldError('longitude');
  const latitudeError = isFieldTouched('latitude') && getFieldError('latitude');
  const radiusError = isFieldTouched('radius') && getFieldError('radius');


  const hasErrors = (fieldsError) => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { title, description, place, longitude, latitude, radius } = props.form.getFieldsValue(["title", "description", "place", "longitude", "latitude", "type", "radius"]);
    marker.set('title', title);
    marker.set('description', description);
    marker.set('latitude', latitude);
    marker.set('longitude', longitude);
    marker.set('place', place);
    marker.set('radius', parseFloat(radius));
    let relation = marker.relation("type_relation");
    await queryType.get(type).then(typeData => {
      relation.add(typeData);
    });
    setTimeout(() => {
      marker.save().then(
        (result) => {
          message.success('Marcação salva!', 2).then(() => {
            props.props.history.push('/panel/markers');
          });
        },
        (error) => {
          setError(true);
          setTimeout(() => {
            setError(false);
          }, 4000);
          console.error('Error while creating or update Marker: ', error);
        }
      );
    }, 1000);
  }
  const routes = [
    {
      path: '',
      breadcrumbName: 'Marcações',
    },
    {
      path: '',
      breadcrumbName: 'Adicionar marcação',
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
        <Form.Item validateStatus={radiusError ? 'error' : ''} help={radiusError || ''}>
          {getFieldDecorator('radius', {
            rules: [{ required: true, message: 'Por favor coloque o raio.' }],
          })(
            <Input
              placeholder="Raio"
            />,
          )}
        </Form.Item>
        <Form.Item validateStatus={placeError ? 'error' : ''} help={placeError || ''}>
          {getFieldDecorator('place', {
            rules: [{ required: true, message: 'Por favor coloque o local.' }],
          })(
            <Input
              placeholder="Lugar"
            />,
          )}
        </Form.Item>
        <div>
          <Form.Item validateStatus={latitudeError ? 'error' : ''} help={latitudeError || ''}>
            {getFieldDecorator('latitude', {
              rules: [{ required: true, message: 'Por favor coloque a latitude.' }],
            })(
              <Input
                placeholder="Latitude"
              />,
            )}
          </Form.Item>
          <Form.Item validateStatus={longitudeError ? 'error' : ''} help={longitudeError || ''}>
            {getFieldDecorator('longitude', {
              rules: [{ required: true, message: 'Por favor coloque a longitude.' }],
            })(
              <Input
                placeholder="Longitude"
              />,
            )}
          </Form.Item>
        </div>
        <Form.Item>
          <Select value={type} style={{ width: 250 }} onChange={(type) => setType(type)}>
            {types.map(({ id, attributes }) => {
              return <Option value={id} key={id}>{attributes.description}</Option>;
            })}
          </Select>
        </Form.Item>
        {error ? <div className="NewsSave-error">Error ao cadastrar notícia</div> : ''}
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
            Salvar
        </Button>
        </Form.Item>
      </Form>
    </>
  )
};

export default Form.create({ name: 'horizontal_login' })(MarkerAddPage);;