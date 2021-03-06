import { Alert, CircularProgress } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const HelloWorld: React.FC = () => {
  const [file, setFile] = useState<any>(null);
  const [isUploaded, setIsUploaded] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e?.target?.files;
    setFile(files);
    console.log('file', files);
  };

  const UploadFn = async () => {
    try {
      if (file) {
        const response = await axios(`${process.env.VITE_REST_ENDPOINT}/getPreSignedUrl`, {
          method: 'POST',
          data: {
            fileName: file[0].name
          }
        });
        return response.data;
      }
    } catch (error) {
      return error;
    }
  };
  const uploadFileHandler = async () => {
    setIsUploaded('started');
    try {
      const response = await UploadFn();
      if (response?.status === 'success') {
        const url = response?.presignedUrl;
        const res = await axios.put(url, file);
        if (res.status === 200) {
          setIsUploaded('uploaded');
        }
        return res;
      }
    } catch (error) {
      return error;
    }
  };
  useEffect(() => {
    if (file) {
      uploadFileHandler();
    }
  }, [file]);

  return (
    <>
      <div className="button-wrapper">
        <span className="label">Select File</span>
        <input type="file" data-testid="element" id="upload" className="upload-box" onChange={(e) => handleChange(e)} />
        <span className="file-text">{file && file[0].name}</span>
      </div>

      <span>
        {isUploaded === 'uploaded' ? (
          <Alert severity="success" sx={{ width: '220px', margin: '20px auto' }} data-testid="handler" id="uploaded">
            File Uploaded Successfully
          </Alert>
        ) : isUploaded === 'started' ? (
          <CircularProgress />
        ) : (
          ''
        )}
      </span>
    </>
  );
};

export default HelloWorld;
