import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {UserContext} from '../AuthContext';
import styled from 'styled-components';
import * as Yup from 'yup';
import { ArrowBackIosNew } from '@mui/icons-material';
import { baseUniformRL } from '../variables';


const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Word = styled.span`
    text-align: center;
    margin: 18px auto;
    font-weight: 600;
    font-size: 14px;
`;

const Form = styled.form`
    display: flex;
    flex-flow: column;
`;


const Input = styled.input`
    border: 1px solid #dadada;
    border-radius: 5px;
    outline: none;
    height: 30px;
    width: 100%;
    padding: 5px;
    margin-top: 5px;
    background-color: var(--color-elements);
    &::placeholder {
        color: #C4C4C4;
        font-size: 12px;
    }
`;

const Button = styled.button`
    color: #eeeeee;
    background-color: #04a7c4;
    border-radius: 5px;
    height: 35px;
    width: 100%;
    outline: none;
    font-size: 14px;
    margin-top: 5px;
    border: none;
    cursor: pointer;
    &:hover {
        border: 2px solid #eeeeee;
        opacity: 0.8;
    }
`;

const SelectBox = styled.div`
    background-color: var(--color-elements);
    box-shadow: 0px 2px 9px rgba(0, 0, 0, 0.059);
    &:hover {
        box-shadow: 0px 2px 9px rgba(0, 0, 0, 0.334);
    }
    border-radius: 5px;
    height: auto;
    padding: 5px;
    width: 350px;
    background-color: #04a7c430;
`;

const Para = styled.p`
    font-size: 13px;
    line-height: 24px;
    margin: 15px auto;
    & a {
        color: #04a7c4;
        cursor: pointer;
        &:hover {
            color: red;
        }
    }
`;

const GoHome = styled.div` 
    position: absolute;
    top: 30px;
    left: 20px;
    &:hover {
        opacity: 0.8;
    }
`;

const Error = styled.p`
    color: red;
`;

const SuccessMessage = styled.div`
    height: auto;
    width: 250px;
    margin: 10px auto;
    padding: 10px;
    color: green;
    background-color: #000;
    border-radius: 5;
    display: flex;
    flex-flow: column;
    font-family: monospace;
    align-items: center;
    justify-content: center;
`;

const FailureMessage = styled.div`
    height: auto;
    width: 250px;
    margin: 10px auto;
    padding: 10px;
    color: red;
    background-color: #000;
    border-radius: 5;
    display: flex;
    flex-flow: column;
    font-family: monospace;
    align-items: center;
    justify-content: center;
`;



const Reset:React.FC = () => {

    const navigate = useNavigate();
    const { user, login } = useContext(UserContext);
    const [success, setSuccess] = useState('');
    const [failure, setFailure] = useState('');

    const formik = useFormik({
        initialValues: {username: '', email: '', newPassword: ''},
        validationSchema: Yup.object({
            username: Yup.string()
                .required('Username is required')
                .min(6, 'Username is too short')
                .max(30, 'Username too long'),
            email: Yup.string()
                .required('Email is required')
                .min(6, 'Email is too short')
                .email('Enter valid email')
                .max(30, 'Email too long'),
            newPassword: Yup.string()
                .required('Password is required')
                .min(6, 'Password is too short')
                .max(30, 'Password too long'),
            }),
        onSubmit: async (values, action) => {
            const vals = {...values};
            action.resetForm();
            setSuccess(`loading...\n Please wait!`);
            try {
                const userData = await axios.put(`${baseUniformRL}/api/v1/users/password`, vals);
                if (userData.data.ok) {
                    setSuccess(userData.data.message + ". You can log in with your new credentials");
                    setTimeout(() => {
                        navigate("/login");
                    }, 3000)
                }
                else if (!userData.data.ok) setFailure(userData.data.message)
            } catch (error: any) {
                const msg: string = error.response.data.message;
                setFailure(msg);
            }
        }
    })
  return (
    <Container>
        <GoHome>
            <Link to='/'><ArrowBackIosNew /></Link>
        </GoHome>
        
        <SelectBox>
            {!failure && success ? <SuccessMessage>{success}</SuccessMessage> : ''}
            {failure ? <FailureMessage>{failure}</FailureMessage> : ''}
                <Form onSubmit={formik.handleSubmit}>
                    <Word>Reset Your Password</Word>

                    <Input onChange={formik.handleChange} onBlur={formik.handleBlur} type='text' name='username' value={formik.values.username} placeholder='Enter Username' />
                    <Error>{formik.errors.username && formik.touched.username && formik.errors.username}</Error>

                    <Input onChange={formik.handleChange} onBlur={formik.handleBlur} type='email' name='email' value={formik.values.email} placeholder='Enter Email' />
                    <Error>{formik.errors.email && formik.touched.email && formik.errors.email}</Error>

                    <Input onChange={formik.handleChange} onBlur={formik.handleBlur} type='password' name='newPassword' value={formik.values.newPassword} placeholder='Enter new Password' />
                    <Error>{formik.errors.newPassword && formik.touched.newPassword && formik.errors.newPassword}</Error>

                    <Button type='submit'>Reset</Button>                    
                </Form>
            </SelectBox>
        
    </Container>
  )
}

export default Reset;
