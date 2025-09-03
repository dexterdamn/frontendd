import React, { createContext, useContext, useState } from 'react';

const ExamContext = createContext();

export const ExamProvider = ({ children }) => {
    const [questions, setQuestions] = useState([]);
    const [isExamActive, setIsExamActive] = useState(false);

    return (
        <ExamContext.Provider value={{ questions, setQuestions, isExamActive, setIsExamActive }}>
            {children}
        </ExamContext.Provider>
    );
};

export const useExamContext = () => {
    return useContext(ExamContext);
};