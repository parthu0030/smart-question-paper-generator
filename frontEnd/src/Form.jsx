import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf'; // <-- import jsPDF
import Answer from './components/Answer';

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '40px',
    gap: '40px',
    background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
  },
  form: {
    background: '#fff',
    padding: '28px',
    borderRadius: '12px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    width: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  heading: {
    margin: 0,
    marginBottom: '10px',
    color: '#2d3a4b',
    textAlign: 'center',
    fontWeight: 600,
    fontSize: '1.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontWeight: 500,
    color: '#3a4a5b',
    marginBottom: '2px',
  },
  input: {
    padding: '8px 10px',
    borderRadius: '6px',
    border: '1px solid #bfc9d1',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border 0.2s',
  },
  button: {
    marginTop: '10px',
    padding: '10px 0',
    borderRadius: '6px',
    border: 'none',
    background: 'linear-gradient(90deg, #4f8cff 0%, #3358e6 100%)',
    color: '#fff',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  outputContainer: {
    background: '#fff',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    width: '500px',
    minHeight: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  outputHeader: {
    fontWeight: '600',
    fontSize: '1.25rem',
    marginBottom: '8px',
    color: '#2d3a4b',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textarea: {
    flexGrow: 1,
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    resize: 'vertical',
    minHeight: '200px',
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
  },
};

function parseGiminiResponse(raw) {
  if (!raw) return '';
  try {
    if (typeof raw === 'string') {
      const parsed = JSON.parse(raw);
      return parsed;
    }
    return raw;
  } catch {
    if (typeof raw === 'string') {
      return raw.replace(/```[\s\S]*?```/g, '').trim();
    }
    return raw;
  }
}

function Form() {
  const [form, setForm] = useState({
    TopicName: '',
    TotalMarks: '',
    MarksForEachQuestion: '',
    QuestionType: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const [status, setStatus] = useState({ type: '', message: '' });
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    setAnswer('');
    try {
      const response = await axios.post('http://localhost:3000/genrate', form);
      setStatus({ type: 'success', message: 'Form submitted successfully!' });

      const responseData = response.data;
      if (responseData && responseData.ans) {
        let processedAnswer = responseData.ans;
        if (typeof processedAnswer === 'string') {
          try {
            processedAnswer = JSON.parse(processedAnswer);
          } catch (e) {
            console.log(e);
            // leave as string
          }
        }
        setAnswer(processedAnswer);
      } else {
        setStatus({
          type: 'error',
          message: 'No questions were generated. Please try again.',
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Failed to generate paper. Please try again.',
      });
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  useEffect(() => {
    if (answer !== null && answer !== undefined && answer !== '') {
      const parsed = parseGiminiResponse(answer);
      if (parsed !== answer) setAnswer(parsed);
    }
  }, [answer]);

  // Updated downloadPDF function supporting multiple pages
  const downloadPDF = () => {
    if (!answer) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const maxLineWidth = pageWidth - margin * 2;
    const lineHeight = 10; // approximate line height in points
    let y = 20; // initial vertical position on page

    const textLines = doc.splitTextToSize(answer.toString(), maxLineWidth);

    doc.setFont('times', 'normal');
    doc.setFontSize(12);

    for (let i = 0; i < textLines.length; i++) {
      if (y + lineHeight > pageHeight - margin) {
        doc.addPage();
        y = margin; // reset y for new page
      }
      doc.text(textLines[i], margin, y);
      y += lineHeight;
    }

    doc.save(`${form.TopicName || 'generated-paper'}.pdf`);
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.heading}>Create Paper</h2>
        <div style={styles.formGroup}>
          <label style={styles.label}>Topic Name:</label>
          <input
            type="text"
            name="TopicName"
            value={form.TopicName}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Total Marks:</label>
          <input
            type="number"
            name="TotalMarks"
            value={form.TotalMarks}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Marks For Each Question:</label>
          <input
            type="number"
            name="MarksForEachQuestion"
            value={form.MarksForEachQuestion}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Question Type:</label>
          <input
            type="text"
            name="QuestionType"
            value={form.QuestionType}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>

        {loading && (
          <div style={{ color: '#3358e6', textAlign: 'center' }}>
            Please wait, generating paper...
          </div>
        )}

        {status.message && (
          <div
            style={{
              color: status.type === 'success' ? 'green' : 'red',
              textAlign: 'center',
            }}
          >
            {status.message}
          </div>
        )}
      </form>

      <div style={styles.outputContainer}>
        <div style={styles.outputHeader}>
          Generated Paper
          <button
            onClick={downloadPDF}
            style={{
              ...styles.button,
              padding: '6px 12px',
              fontSize: '0.875rem',
              margin: 0,
              cursor: answer ? 'pointer' : 'not-allowed',
              opacity: answer ? 1 : 0.5,
              width: 'auto',
              height: '32px',
            }}
            disabled={!answer}
            title={answer ? 'Download as PDF' : 'No content to download'}
            type="button"
          >
            Download PDF
          </button>
        </div>
        <textarea
          style={styles.textarea}
          value={answer}
          onChange={handleAnswerChange}
          placeholder="Your generated paper will appear here..."
        />
      </div>
    </div>
  );
}

export default Form;
