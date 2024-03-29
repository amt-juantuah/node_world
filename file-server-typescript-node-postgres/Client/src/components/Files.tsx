import { SearchRounded } from '@mui/icons-material';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import File from './FileOne';
import axios from 'axios';
import { UserContext } from '../AuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { baseUniformRL } from '../variables';

const Container = styled.div`
    width: 100vw;
    height: auto;
    padding: 48px 81px;
    position: relative;
    display: flex;
    flex-flow: column;
    transition: all 700ms;
    @media screen and (max-width: 680px) {
        padding-left: 28px;
        padding-right: 28px;
      }
`;

const FilterBox = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 48px;
    @media screen and (max-width: 680px) {
        flex-flow: column-reverse;
        align-items: center;
        gap: 20px;
    }
`;

const SearchBox = styled.div`
    height: 56px;
    width: 480px;
    display: flex;
    background-color: var(--color-elements);
    border-radius: 5px;
    box-shadow: 0px 2px 9px rgba(0, 0, 0, 0.059);
    &:hover {
        box-shadow: 0px 2px 9px rgba(0, 0, 0, 0.334);
    }
    @media screen and (max-width: 680px) {
        height: 48px;
        width: 343px;
    }
`;

const Search = styled.input`
    border: none;
    outline: none;
    flex: 1;
    height: 100%;
    width: 100%;
    background-color: var(--color-elements);
    &::placeholder {
        color: #C4C4C4;
        font-size: 12px;
    }
`;

const SearchIconBox = styled.div`
    flex: 0.2;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
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
    width: 300px;
`;

const Option = styled.option`
    line-height: 20px;
    margin-top: 10px;
    margin-bottom: 10px;
    @media screen and (max-width: 680px) {
        font-size: 12px;
        margin-top: 10px;
      }
`;

const All = styled.div`
    width: 100%;
    height: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    row-gap: 75px;
    column-gap: 48px;
    margin-bottom: 50px;
    @media screen and (max-width: 680px) {
        padding-left: 27px;
        padding-right: 27px;
        justify-content: center;
      }
`;

const Word = styled.span`
    text-align: center;
    margin: 18px auto;
    font-weight: 600;
    font-size: 14px;
`;

const HeadWord = styled.h2`
    text-align: left;
    margin-bottom: 30px;
    margin-top: 80px;
    padding-left: 15px;
    font-weight: 600;
    border-left: 5px solid gold;
`;

const NotLogWord = styled.span`
    text-align: center;
    margin: 18px auto;
    font-weight: 300;
    font-size: 13px;
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

const Select = styled.select`
    border: 1px solid #dadada;
    border-radius: 5px;
    outline: none;
    height: 30px;
    width: 100%;
    padding: 5px;
    margin-top: 5px;
    background-color: var(--color-elements);
`;

const Button = styled.button`
    color: #eeeeee;
    background-color: #04a7c4;
    border-radius: 5px;
    height: 28px;
    width: 100%;
    border: none;
    outline: none;
    font-size: 14px;
    margin-top: 5px;
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


type Props = {
    file: UnstructuredObject;
    allFiles: UnstructuredObject[];
}

type UnstructuredObject = {
    [key: string]: any;
}


const Files: React.FC<Props> = props => {

    const { file, allFiles } = props;

    const {user} = useContext(UserContext);
    const [success, setSuccess] = useState('');
    const [failure, setFailure] = useState('');
    
    const [files, setFiles] = useState(allFiles);
    const [publicfiles, setPublicFiles] = useState(allFiles);
    const [searcher, setSearcher] = useState('');

    const getData = async () => {
        try {
            if (user && user.id) {

                const { data } = await axios.get(
                    `${baseUniformRL}/api/v1/files/${user.id}/${user.email}`,
                    {
                        headers: {
                            Accept: 'application/json',
                        },
                    }
                );
                setFiles(data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getPublicData = async () => {
        try {
            if (user && user.id) {

                const { data } = await axios.get(
                    `${baseUniformRL}/api/v1/files/public/${user.id}/${user.email}`,
                    {
                        headers: {
                            Accept: 'application/json',
                        },
                    }
                );
                setPublicFiles(data);
            }
        } catch (error) {
            console.log(error);
        }
    };
    
//    get all data after a new file is added
    useEffect(() => {        
        getPublicData();
        getData();    
    }, [success]);
    
//     formik to manage adding a new file
    const formik = useFormik({
        initialValues: {file_title: '', file_description: ''},
        validationSchema: Yup.object({
            file_title: Yup.string()
                .required('Title is required')
                .min(5, 'Title is too short')
                .max(30, 'Title is too long'), 
            file_description: Yup.string()
                .required('Description is required')
                .min(10, 'Decription is too short')
                .max(200, 'Description is too long'), 
            document: Yup.mixed()
                .required('File is required'),
        }),
        onSubmit: async (values, action) => {
            const vals = {...values, email: user?.email};
            console.log(vals)
            action.resetForm();
            (document.getElementById("formID") as HTMLFormElement).reset();
            setSuccess("Uploading your file... Please wait");
            try {
                const uploadedFile = await axios.post(`${baseUniformRL}/api/v1/files/upload/${user?.id}`, vals, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Access-Control-Allow-Origin": "*",
                      },
                });

                if (uploadedFile.data.ok) {
                    setSuccess(uploadedFile.data.message);
                }
                else if (!uploadedFile.data.ok) setFailure(uploadedFile.data.message);
                setTimeout(()=>{
                    setFailure('');
                    setSuccess('');
                },3000)
                
            } catch (error: any) {
                const msg: string = error.response.data.message;
                setFailure(msg);
                setTimeout(()=>{
                    setFailure('');
                    setSuccess('');
                },3000)
            }
        }

    })

    //     admin formik to manage adding a new file
    const adminformik = useFormik({
        initialValues: {file_title: '', file_description: ''},
        validationSchema: Yup.object({
            file_title: Yup.string()
                .required('Title is required')
                .min(5, 'Title is too short')
                .max(30, 'Title is too long'), 
            file_description: Yup.string()
                .required('Description is required')
                .min(10, 'Decription is too short')
                .max(200, 'Description is too long'), 
            // privacy: Yup.object().required('file privacy is required'),
            document: Yup.mixed()
                .required('File is required'),
        }),
        onSubmit: async (values, action) => {
            const vals = {...values, email: user?.email};
            console.log(vals)
            action.resetForm();
            (document.getElementById("formID") as HTMLFormElement).reset();
            setSuccess("Uploading your file... Please wait");
            try {
                const uploadedFile = await axios.post(`${baseUniformRL}/api/v1/files/upload/admin/${user?.id}`, vals, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Access-Control-Allow-Origin": "*",
                      },
                });

                if (uploadedFile.data.ok) {
                    setSuccess(uploadedFile.data.message);
                }
                else if (!uploadedFile.data.ok) setFailure(uploadedFile.data.message);
                setTimeout(()=>{
                    setFailure('');
                    setSuccess('');
                },3000)
                
            } catch (error: any) {
                const msg: string = error.response.data.message;
                setFailure(msg);
                setTimeout(()=>{
                    setFailure('');
                    setSuccess('');
                },3000)
            }
        }

    })


    useEffect( () => {
        getData();
        getPublicData();
    },[]);

    // const docFile = {
    //     file_format: 'application/pdf',
    //     file_name: 'not_a_real_file.pdf',
    //     downloads: 3445,
    //     file_title: 'Example File',
    //     file_description: 'This is a test file'
    // }


  return (
    <Container>
        <FilterBox>
            <SearchBox>
                <SearchIconBox>
                    <SearchRounded />
                </SearchIconBox>
                <Search type="text" /*onChange={handleSearch}*/ name='search' onChange={(e) => setSearcher(String(e.target.value).toLowerCase())} placeholder="Search for a file..."/>
            </SearchBox>
            { user && user.isadmin ? 
                <SelectBox>
                    {!failure && success ? <SuccessMessage>{success}</SuccessMessage> : ''}
                    {failure ? <FailureMessage>{failure}</FailureMessage> : ''}
                    <Form id="formID" onSubmit={adminformik.handleSubmit} encType="multipart/form-data">
                        <Word>Add Document as ADMINISTRATOR</Word>
                        { user.id ?
                            <>
                                <Input onChange={adminformik.handleChange} onBlur={adminformik.handleBlur} value={adminformik.values.file_title} type='text' name='file_title' placeholder='Enter doc title' />
                                <Error>{adminformik.errors.file_title && adminformik.touched.file_title && adminformik.errors.file_title}</Error>
                                <Input onChange={adminformik.handleChange} onBlur={adminformik.handleBlur} value={adminformik.values.file_description} type='text' name='file_description' placeholder='Enter doc description' />
                                <Error>{adminformik.errors.file_description && adminformik.touched.file_description && adminformik.errors.file_description}</Error>
                                <Select name='privacy' onChange={(e) => {console.log(e.currentTarget.value); adminformik.setFieldValue('privacy', e.currentTarget.value)}} 
                                onBlur={adminformik.handleBlur}>
                                    <Option value=''>--choose file privacy--</Option>
                                    <Option value='private'>private</Option>
                                    <Option value='public'>public</Option>
                                </Select>
                                <Input required onChange={(e) => {
                                    if(e.currentTarget.files) {                                
                                        adminformik.setFieldValue('document', e.currentTarget.files[0])}}} onBlur={adminformik.handleBlur}  type='file' name='document' />
                                {/* <Error>{adminformik.errors.document && adminformik.touched.document && adminformik.errors.document}</Error> */}
                                <Button type='submit'>Upload File</Button>
                            </>
                            : <NotLogWord>Create account or Log in to add files to your personal documents store</NotLogWord>
                        }
                    </Form>
                </SelectBox>
            :
                <SelectBox>
                    {!failure && success ? <SuccessMessage>{success}</SuccessMessage> : ''}
                    {failure ? <FailureMessage>{failure}</FailureMessage> : ''}
                    <Form id="formID" onSubmit={formik.handleSubmit} encType="multipart/form-data">
                        <Word>Have a Document to add to your Store Here?</Word>
                        { user && user.id ?
                            <>
                                <Input onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.file_title} type='text' name='file_title' placeholder='Enter doc title' />
                                <Error>{formik.errors.file_title && formik.touched.file_title && formik.errors.file_title}</Error>
                                <Input onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.file_description} type='text' name='file_description' placeholder='Enter doc description' />
                                <Error>{formik.errors.file_description && formik.touched.file_description && formik.errors.file_description}</Error>
                                
                                <Input required onChange={(e) => {
                                    if(e.currentTarget.files) {                                
                                        formik.setFieldValue('document', e.currentTarget.files[0])}}} onBlur={formik.handleBlur}  type='file' name='document' />
                                {/* <Error>{formik.errors.document && formik.touched.document && formik.errors.document}</Error> */}
                                <Button type='submit'>Upload File</Button>
                            </>
                            : <NotLogWord>Create account or Log in to add files to your personal documents store</NotLogWord>
                        }
                    </Form>
                </SelectBox>
            }
        </FilterBox>
        <HeadWord>{user?.id && files ? `YOUR PRVATE FILES: Available to only You` : ""}</HeadWord>
        <All style={{justifyContent: "space-evenly"}}>
            { user?.id && files.length ?
                files
                    .filter(fyl => String(fyl.file_title).toLowerCase().includes(searcher) || String(fyl.file_description).toLowerCase().includes(searcher))
                    .map((item, index) => <File key={index} docFile={item} />)
                : user?.id && !files.length ?
                    <NotLogWord>No Private Files. Add a New File </NotLogWord>
                : <NotLogWord>Login to view your files </NotLogWord>
            }
                        
        </All>
        <HeadWord>{user?.id ? `ALL PUBLIC FILES: Available to the Public` : ""}</HeadWord>
        <All style={{justifyContent: "space-evenly"}}>
            { user?.id && publicfiles.length ?
                publicfiles
                    .filter(fyl => String(fyl.file_title).toLowerCase().includes(searcher) || String(fyl.file_description).toLowerCase().includes(searcher))
                    .map((item, index) => <File key={index} docFile={item} />)
                : user?.id && !publicfiles.length ?
                <NotLogWord>No Public Files Available as at Now. Check back later</NotLogWord>
                : <NotLogWord> Public Files are Available to only registered users. Login or Register for free</NotLogWord>
                    
            }
                        
        </All>
    </Container>
  )
} 

export default Files;
