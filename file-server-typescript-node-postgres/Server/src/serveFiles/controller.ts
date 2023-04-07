// This module contains functions 
// for handling requests


// required dependencies
import { Request, Response, NextFunction } from 'express';
import pool from './../dtb';
import { deleteFileFromDisk, setError } from './mdw';
import nodeMailer from 'nodemailer';
import { 
    createOneUser, 
    getAllFiles, 
    getAllUsers,
    getOneUserByUsernameAndPassword,
    deleteOneUser, 
    updateOneUserUsername,
    updateOneUserPassword,
    getOneUserById,
    uploadOneFile,
    uploadPublicFile,
    getPrivateFilesForUser
} from './queries';
import { error } from 'console';



// Interacting with the Users table

/**
 * Gets all users in the db
 * @param req requet object
 * @param res response object
 * @param next push to next
 */
export const getUsers = (req: Request, res: Response, next: NextFunction) => {
    try {

        pool.query(getAllUsers, (error, results) => {
            if (error) {
                setError(error, next, 400);
            }
            else res.status(200).json(results.rows);
        })
        
    } catch (error) {
        next(error)
    }
}



export const createUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            const errorMessage = 'username and email and password are required fields. At least one of them is missing or wrong';
            setError(errorMessage, next, 422);
        }
        else {
            pool.query(createOneUser, [username, email, password], (error, results) => {
                if (error) {
                    setError(error, next, 400);
                }
                else {
                    res.status(201).json({
                        ok: true,
                        message: "Account was created Successfully. You can Log in with your credentials",
                        user: {
                            username: username,
                            email: email
                        }               
                    });

                    
                }
            })
        }
        
    } catch (error) {
        next(error);
    }
}

/**
 * Get a user by username and password
 * @param req request object
 * @param res response object
 * @param next next function
 */
export const getAUserByUsernameAndPassword = (req: Request, res: Response, next: NextFunction) => {
    try {

        const { username, password } = req.body;

        if (!username || !password) {
            const errorMessage = 'username and password are required fields. At least one of them is missing or wrong';
            setError(errorMessage, next, 422);
        }
        else {
            pool.query(getOneUserByUsernameAndPassword, [username, password], (error, results) => {
                if (error) {
                    setError(error, next, 400);
                }
                else if (results.rows[0]) {
                    const {password, ...user} = results.rows[0];
                    res.status(200).json({
                        ok: true,
                        message: "Welcome Back",
                        user: user
                    });
                }
                else next(new Error("Either Username or Password is wrong"))
            })
        }
    } catch (error) {
        next(error);
    }
}

/**
 * Get a user by id && must be authorized
 * @param req request object
 * @param res response object
 * @param next next function
 */
export const getAUserById = (req: Request, res: Response, next: NextFunction) => {
    try {

        const id = req.params.id;

        if (!id) {
            const errorMessage = 'id in params is required field';
            setError(errorMessage, next, 400);
        }
        else {
            pool.query(getOneUserById, [id], (error, results) => {
                if (error) {
                    setError(error, next, 400);
                }
                else {
                    const {password, ...user} = results.rows[0];
                    res.status(200).json(user);
                };
            })
        }
    } catch (error) {
        next(error);
    }
}

/**
 * delete a user account by administrator
 * @param req request object
 * @param res response object
 * @param next next function
 */
export const deleteAUserById = (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const { email, password, username } = req.body;

        if (!id || !email || !password || !username) {
            const errorMessage = 'id, email, password, and username are required fields for deletion';
            setError(errorMessage, next, 400);
        }
        else {
            pool.query(getOneUserById, [id], (error, results) => {
                if (error) {
                    setError(error, next, 400);
                } else if (!results.rows.length) {
                    const errorMessage = 'Deletion unsuccessful. User not found';
                    setError(errorMessage, next, 404);
                }
                else {
                    pool.query(deleteOneUser, [id, email, password, username], (error, results) => {
                        if (error) {
                            setError(error, next, 400);
                        }
                        else if (!results.rowCount) {
                            const errorMessage = 'Some of the credentials provided was invalid';
                            setError(errorMessage, next, 400);
                        } 
                        else if (results.rowCount) {
                            res.status(200).json({
                                ok: true,
                                message: "Account deleted successfully"              
                            });
                        }
                        else {
                            const errMessage = 'Something broke. Our Engineers are checking it!';
                            setError(errMessage, next, 500);
                        }
                    })
                };
            })
        }

    } catch (error) {
        next(error);
    }
}


/**
 * update the username of a user account
 * @param req request object
 * @param res response object
 * @param next next function
 */
export const updateAUserUsername = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password, newUsername } = req.body;

        if (!username || !password || !newUsername) {
            const errorMessage = 'old username, password, and new username are required fields for username updates';
            setError(errorMessage, next, 400);
        }
        else {
            pool.query(getOneUserByUsernameAndPassword, [username, password], (error, results) => {
                if (error) {
                    setError(error, next, 400);
                } else if (!results.rows.length) {
                    const errorMessage = 'Update unsuccessful. Record not found';
                    setError(errorMessage, next, 404);
                }
                else {
                    pool.query(updateOneUserUsername, [newUsername, password, username], (error, results) => {
                        if (error) {
                            setError(error, next, 400);
                        }
                        else if (!results.rowCount) {
                            const errorMessage = 'Some of the credentials provided was invalid';
                            setError(errorMessage, next, 400);
                        } 
                        else if (results.rowCount) {
                            res.status(200).json({
                                ok: true,
                                message: "Account updated successfully"              
                            });
                        }
                        else {
                            const errMessage = 'Something broke. Our Engineers are checking it!';
                            setError(errMessage, next, 500);
                        }
                    })
                };
            })
        }

    } catch (error) {
        next(error);
    }
}


/**
 * update the password of a user account
 * @param req request object
 * @param res response object
 * @param next next function
 */
export const updateAUserPassword = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password, newPassword } = req.body;

        if (!username || !password || !newPassword) {
            const errorMessage = 'username, old password, and new password are required fields for username updates';
            setError(errorMessage, next, 400);
        }
        else {
            pool.query(getOneUserByUsernameAndPassword, [username, password], (error, results) => {
                if (error) {
                    setError(error, next, 400);
                } else if (!results.rows.length) {
                    const errorMessage = 'Update unsuccessful. Record not found';
                    setError(errorMessage, next, 404);
                }
                else {
                    pool.query(updateOneUserPassword, [newPassword, password, username], (error, results) => {
                        if (error) {
                            setError(error, next, 400);
                        }
                        else if (!results.rowCount) {
                            const errorMessage = 'Some of the credentials provided was invalid';
                            setError(errorMessage, next, 400);
                        } 
                        else if (results.rowCount) {
                            res.status(200).json({
                                ok: true,
                                message: "Account updated successfully"              
                            });
                        }
                        else {
                            const errMessage = 'Something broke. Our Engineers are checking it!';
                            setError(errMessage, next, 500);
                        }
                    })
                };
            })
        }

    } catch (error) {
        next(error);
    }
}

// TODO: Move this section to a separate controller

// interacting with the files table



/**
 * Gets All files from db
 * @param req requet object
 * @param res response object
 */
export const getFiles = (req: Request, res: Response, next: NextFunction) => {
    try {

        pool.query(getAllFiles, (error, results) => {
            if (error) {
                setError(error, next, 400);
            }
            else res.status(200).json(results.rows);
        })
        
    } catch (error) {
        next(error);
    }
};


/**
 * Upload one file as public file for all user
 * @param req requet object
 * @param res response object
 */
export const uploadOnePublicFile = (req: Request, res: Response, next: NextFunction) => {
    try {

        const { 
            file_title,
            file_name,
            file_description,
            file_format,
            file_url,
            email
        } = req.body;
        if (!file_title || !file_name || !file_description || !file_format || !file_url || !email) {
            req.file? deleteFileFromDisk(req.file?.path) : '';
            const errorMessage = 'Document not saved in DB. Something went wrong';
            setError(errorMessage, next, 400);
        }
        else {
            
            pool.query(uploadPublicFile,[file_name, file_description, file_format, file_url, email], (error, results) => {
                if (error) {                    
                    req.file? deleteFileFromDisk(req.file?.path) : '';
                    setError(error, next, 400);
                }
                else {
                    res.status(201).json({
                        ok: true,
                        message: "Document was saved Successfully with the following information",
                        document: {
                            file_title: file_title,
                            file_description: file_description,
                            downloads: 0,
                            file_format: file_format,
                            file_name: file_name,
                        }               
                    });
                }
            })
        }
        
    } catch (error) {
        deleteFileFromDisk(req.file?.path || '');
        next(error);
    }
};


/**
 * Upload one file as private file for a user
 * @param req requet object
 * @param res response object
 */
export const uploadFile = (req: Request, res: Response, next: NextFunction) => {
    try {

        const { 
            file_title,
            file_name,
            file_description,
            file_format,
            file_url,
            email
        } = req.body;
        if (!file_title || !file_name || !file_description || !file_format || !file_url || !email) {
            req.file? deleteFileFromDisk(req.file?.path) : '';;
            const errorMessage = 'Document not saved in DB. Required fields not provided';
            setError(errorMessage, next, 400);
        }
        else {
           
            pool.query(uploadOneFile,[file_name, file_description, file_format, file_url, email, file_title], (error, results) => {
                if (error) {                    
                    req.file? deleteFileFromDisk(req.file?.path) : '';
                    setError(error, next, 400);
                }
                else {
                    res.status(201).json({
                        ok: true,
                        message: "Document was saved Successfully",
                        document: {
                            file_description: file_description,
                            file_title: file_title,
                            file_name: file_name,
                            file_format: file_format,
                            file_url: file_url,   
                            user_email: email
                        }               
                    });
                }
            })
        }
        
    } catch (error) {
        deleteFileFromDisk(req.file?.path || '');
        next(error);
    }
};

export const getPrivateFilesForOneUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.params.email;
        pool.query(getPrivateFilesForUser, [email], function (error, results) {
            if (error) {
                setError(error, next, 400);
            }
            else {
                res.status(200).json(results.rows);
            }
        })
    } catch (error) {
        next(error);
    }
}

export const downloadFile = (req: Request, res: Response, next: NextFunction) => {
    const { file_name } = req.body;
    try {
        res.download(`./public/uploads/${file_name}`, function (error) {
            if (error) {
                console.log(error);
                next(error);
            } else  {
                pool.query("UPDATE files SET downloads=downloads+1 WHERE file_name=$1", [file_name], function (error, results) {
                    if (error) {
                        setError(error, next, 400);
                    }
                    else {
                        console.log("file sent");
                    }
                });                
            }
        })
    } catch (error) {
        next(error);
    }
}



export const sendFileAsMail = async (req: Request, res: Response, next: NextFunction) => {
    const {username, fileName, senderEmail, receiverEmail } = req.body;
    try {
        let testAccount = await nodeMailer.createTestAccount();
        const transporter = await nodeMailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: "documenthubstore@gmail.com",
                pass: 'jgacqetnoneugsez',
            }
        });
        let info = await transporter.sendMail({
            from: `<--| ${senderEmail} |-->`,
            to: `${receiverEmail}`,
            subject: "Sent You a New File From Document Hub",
            text: `You have recieved a new file from ${username}`,
            html: `<p> You have recieved a new file from ${username} </p>`,
            attachments: [{ path: `./public/uploads/${fileName}`}]
            }, 
            (error, data) => {
                if (error) console.log(error)
                else res.send("Email Sent")
            }
        )

    } catch (error) {
        console.log(error)
        next(error);
    }
}




