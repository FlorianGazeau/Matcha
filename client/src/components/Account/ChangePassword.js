import React, { Component } from 'react'
import { Container, Row, Col, Input, Button, Card, CardBody } from 'mdbreact'
import FormValidator from '../FormValidator/FormValidator'
import { Message } from 'semantic-ui-react'
import axios from 'axios'

class ChangePassword extends Component {
  constructor (props) {
    super(props)
    this.validator = new FormValidator([
      {
        field: 'pwd',
        method: 'isEmpty',
        validWhen: false,
        message: 'Password is required.'
      },
      {
        field: 'pwd',
        method: 'matches',
        args: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/],
        validWhen: true,
        message: 'Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number.'
      },
      {
        field: 'newpwd',
        method: 'isEmpty',
        validWhen: false,
        message: 'Password is required.'
      },
      {
        field: 'newpwd',
        method: 'matches',
        args: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/],
        validWhen: true,
        message: 'Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number.'
      },
      {
        field: 'cnewpwd',
        method: 'isEmpty',
        validWhen: false,
        message: 'Confirmation is required.'
      },
      {
        field: 'cnewpwd',
        method: this.passwordMatch,
        validWhen: true,
        message: 'Password and confirmation password do not match',
      }
    ])
    this.state = {
      pwd : '',
      newpwd : '',
      cnewpwd : '',
      message: '',
      validation: this.validator.valid(),
    }
    this.onSubmitPass = this.onSubmitPass.bind(this)
    this.onChange = this.onChange.bind(this)
    this.submitted = false
  }
  passwordMatch = (cnewpwd, state) => (state.newpwd === cnewpwd)

  onChange = (e) => {
    this.setState( {
        [e.target.name]: e.target.value
    })
  }

  onSubmitPass = (e) => {
    const validation = this.validator.validate(this.state)
    this.setState({ validation })
    this.submitted = true
    if (validation.isValid) {
      const id = localStorage.id
      const {pwd, newpwd, cnewpwd} = this.state
      axios.post('/changepassword', {pwd, newpwd, cnewpwd, id})
      .then((result) => {
        if (result.data === 'GOOD') {
          this.setState ({
            message: 'Votre Password a bien été modifié'
          })
        }
        if (result.data === 'ERROR') {
          this.setState ({
            message: 'Wrong Password'
          })
        }
      })
    }    
  }
  
  render () {
    let validation = this.submitted ? this.validator.validate(this.state) : this.state.validation
    return (
      <Container>
        <Row>
          <Col md='6'>
            <Card>
              <CardBody>
                <p className='h4 text-center py-4'>Change Password</p>
                <div className='grey-text'>
                  <div>                                            
                    <Input name='pwd' label='Your password' icon='user' group type='password' validate error='wrong' success='right' onChange={this.onChange}/>
                    <span>{validation.pwd.message}</span>
                  </div>
                  <div>
                    <Input name='newpwd' label='New password' icon='user' group type='password' validate error='wrong' success='right' onChange={this.onChange}/>
                    <span>{validation.newpwd.message}</span>
                  </div>
                  <div>
                    <Input name='cnewpwd' label='Confirm new password' icon='user' group type='password' validate error='wrong' success='right' onChange={this.onChange}/>
                    <span>{validation.cnewpwd.message}</span>
                  </div>
                  <div className='text-center py-4 mt-3'>
                    <Button color='cyan' onClick={this.onSubmitPass}>Submit</Button>
                  </div>
                  <div>
                    {this.state.message === '' ? '' : <Message floating>{this.state.message}</Message>}
                  </div> 
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default ChangePassword
