import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [tweetResponse, setTweetResponse] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus('Please select an image file.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadStatus('Uploading...');
      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setUploadStatus('Upload successful!');
      setTweetResponse(res.data);
    } catch (error) {
      console.error(error);
      setUploadStatus('Upload failed.');
    }
  };

  return (
    <div>
      <input type="file" accept="image/png, image/jpeg" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload and Post</button>
      {uploadStatus && <p>{uploadStatus}</p>}
      {tweetResponse && (
        <div>
          <h3>Tweet Posted</h3>
          <pre>{JSON.stringify(tweetResponse, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
