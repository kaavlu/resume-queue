import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./Comment.css";

// Initialize Supabase client
const supabase = createClient("https://uymijhbrlxhwxbdbijts.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5bWlqaGJybHhod3hiZGJpanRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2MjcwNjksImV4cCI6MjAzMTIwMzA2OX0.bDtcmG0XMTzB0CkeBTJbzClx2-xn3CXoqoYwCJspWJU");

const Comment: React.FC = () => {
  const [resume, setResume] = useState<{ id: number; email: string; comments_upload: string } | null>(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const fetchResume = async () => {
    const { data, error } = await supabase
      .from("resume-data")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching data:", error);
      return;
    }

    if (data) {
      setResume(data);
      fetchPdfUrl(data.email);
    } else {
      setResume(null);
    }
  };

  const fetchPdfUrl = async (email: string) => {
    const fileName = `${email}.pdf`;
    const { data } = await supabase.storage
      .from("resumes")
      .getPublicUrl(fileName);

    if (data.publicUrl) {
      setPdfUrl(`${data.publicUrl}?t=${new Date().getTime()}`);
    } else {
      console.error("No public URL available");
    }
  };

  useEffect(() => {
    fetchResume();
  }, [submitted]);

  useEffect(() => {
    if (resume) {
      const username = resume.email.split('@')[0];
      setUsername(username);
      setEmail(resume.email);
    } else {
      setPdfUrl("");
      setUsername("");
      setEmail("");
    }
  }, [resume]);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (resume) {
      const fileName = `${resume.email}.pdf`;

      // Delete the resume file
      const { error: deleteFileError } = await supabase.storage
        .from("resumes")
        .remove([fileName]);

      if (deleteFileError) {
        console.error("Error deleting resume file:", deleteFileError);
        return;
      }

      // Delete the resume-data row
      const { error: deleteDataError } = await supabase
        .from("resume-data")
        .delete()
        .eq("email", resume.email);

      if (deleteDataError) {
        console.error("Error deleting resume data:", deleteDataError);
        return;
      }

      // Fetch the next oldest resume
      await fetchResume();
    }

    // Trigger a re-render
    setSubmitted((prev) => !prev);

    // Submit the form
    const form = event.target as HTMLFormElement;
    form.submit();
  };

  return (
    <section id="Comment" className="comment-section">
      <div className="left-panel">
        <h3>{username ? `${username}'s Resume` : "Loading..."}</h3>
        {pdfUrl && <iframe src={pdfUrl} title="Resume PDF" className="resume-pdf"></iframe>}
      </div>
      <div className="right-panel">
        <div className="comments-display">
          <h4>{username ? `${username}'s Comments` : "User Comments"}</h4>
          <p>{resume ? resume.comments_upload : "No comments yet."}</p>
        </div>
        {/* FormSubmit form */}
        <div className="container">
          {email && (
            <form target="_blank" action={`https://formsubmit.co/${email}`} method="POST" onSubmit={handleFormSubmit}>
              <div className="form-group">
                <div className="form-row">
                  <div className="col">
                    <input type="text" name="name" className="form-control" placeholder="Full Name" required />
                  </div>
                  <div className="col">
                    <input type="email" name="email" className="form-control" placeholder="Email Address" required />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <textarea placeholder="Your Message" className="form-control" name="message" rows="10" required></textarea>
              </div>
              <button type="submit" className="btn btn-lg btn-dark btn-block">Submit Form</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Comment;
