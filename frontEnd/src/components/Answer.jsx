import React from 'react';

const styles = {
  container: {
    marginTop: "16px",
    padding: "16px",
    border: "1px solid #bfc9d1",
    borderRadius: "8px",
    background: "#f5faff",
    color: "#2d3a4b",
    textAlign: "left",
    maxHeight: "400px",
    overflowY: "auto"
  },
  paperHeader: {
    borderBottom: "2px solid #3358e6",
    paddingBottom: "8px",
    marginBottom: "16px"
  },
  questionSection: {
    marginBottom: "20px"
  },
  question: {
    marginBottom: "12px",
    padding: "8px",
    backgroundColor: "#ffffff",
    borderRadius: "4px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
  },
  questionHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px"
  },
  marks: {
    color: "#3358e6",
    fontWeight: "500"
  }
};

const Answer = ({ answer }) => {
  if (!answer) return null;

  const renderQuestion = (question, index) => {
    if (typeof question === 'string') {
      return (
        <div style={styles.question} key={index}>
          <div style={styles.questionHeader}>
            <span>Question {index + 1}</span>
            <span style={styles.marks}>Marks: {question.marks || "N/A"}</span>
          </div>
          <div>{question}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={styles.container}>
      <div style={styles.paperHeader}>
        <h3>Generated Question Paper</h3>
      </div>
      <div style={styles.questionSection}>
        {Array.isArray(answer) ? (
          answer.map((question, index) => renderQuestion(question, index))
        ) : typeof answer === 'string' ? (
          <div style={styles.question}>{answer}</div>
        ) : (
          <pre>{JSON.stringify(answer, null, 2)}</pre>
        )}
      </div>
    </div>
  );
};

export default Answer;