import axios from 'axios';

const API_URL = 'http://localhost:5000/questions'; // Adjust the base URL as needed

export const createQuestion = async (data) => {
    return await axios.post(API_URL, data);
};

// export const getQuestionsByExam = async (examId) => {
//     return await axios.get(`${API_URL}/${examId}`);
// };

export const getQuestionsByExam = async (examId) => {
  return await axios.get(`http://localhost:5000/questions/exam/${examId}`);
};


export const updateQuestion = async (id, data) => {
    return await axios.put(`${API_URL}/${id}`, data);
};

export const deleteQuestion = async (id) => {
    return await axios.delete(`${API_URL}/${id}`);
};
// Lock exam function
export const lockExam = async (examId) => {
    return await axios.put(`http://localhost:5000/exams/${examId}/lock`);
};
export const unlockExam = async (examId) => {
  return await axios.put(`http://localhost:5000/exams/${examId}/unlock`);
};
export const getExamById = async (examId) => {
  return axios.get(`http://localhost:5000/exams/${examId}`);
};