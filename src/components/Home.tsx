import React, { useState } from 'react';
import { Container, Button, Form, Alert } from "react-bootstrap";
import { FaUpload } from "react-icons/fa";
import { createClient } from "@supabase/supabase-js";
import "./Home.css";

const supabase = createClient("https://uymijhbrlxhwxbdbijts.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5bWlqaGJybHhod3hiZGJpanRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2MjcwNjksImV4cCI6MjAzMTIwMzA2OX0.bDtcmG0XMTzB0CkeBTJbzClx2-xn3CXoqoYwCJspWJU");

const Home: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState('');
  const [comments, setComments] = useState('');
  const [message, setMessage] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleCommentsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComments(event.target.value);
  };

  const resetForm = () => {
    setFile(null);
    setEmail('');
    setComments('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !file) {
      setMessage('Please fill in all required fields.');
      return;
    }

    const fileName = `${email}.pdf`;

    const { data: existingFile, error: existingFileError } = await supabase.storage
      .from('resumes')
      .list('', { limit: 1, search: fileName });

    if (existingFileError) {
      setMessage('Error checking for existing file.');
      console.error('Error checking for existing file:', existingFileError);
      return;
    }

    // If file exists, delete it
    if (existingFile && existingFile.length > 0) {
      const { error: deleteError } = await supabase.storage
        .from('resumes')
        .remove([fileName]);

      if (deleteError) {
        setMessage('Error deleting existing file.');
        console.error('Error deleting existing file:', deleteError);
        return;
      }
    }

    console.log(fileName);
    const { data, error } = await supabase.storage
      .from('resumes')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading file:', error.message);
    } else {
      console.log('File uploaded successfully:', data);
    }

    const { data: uploadData, error: uploadError } = await supabase
        .from('resume-data')
        .insert([{ email: email, comments_upload: comments }]);

    if (uploadError) {
        console.error('Error uploading Data:', uploadError.message);
        return;
    }else{
        console.log('Data added successfully:', uploadData);
    }

    setMessage('File uploaded and data saved successfully!');
    resetForm();
  };

  return (
    <Container fluid className="p-0">
      <section id="home" className="d-flex flex-column justify-content-center align-items-center home-section">
        <Form onSubmit={handleSubmit}>
          {message && <Alert variant="info">{message}</Alert>}
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Upload your resume</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>
          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Email (required)</Form.Label>
            <Form.Control type="email" required placeholder="Enter email" value={email} onChange={handleEmailChange} />
          </Form.Group>
          <Form.Group controlId="formComments" className="mb-3">
            <Form.Label>Comments</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Add comments" value={comments} onChange={handleCommentsChange} />
          </Form.Group>
          <Button variant="primary" type="submit">
            <FaUpload /> Upload
          </Button>
        </Form>
      </section>
    </Container>
  );
};

export default Home;