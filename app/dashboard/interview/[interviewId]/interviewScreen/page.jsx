"use client"
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { act, useEffect, useState } from 'react'
import QuestionsSec from './QuestionsSec';
import RecordAnswer from './RecordAnswer';
import { useSelector } from 'react-redux';

function StartInterview({params}) {

  const currentInterviewDetail = useSelector(
    (state) => state.currentInterviewDetail.data
  );

  const [interviewData,setInterviewData]=useState();
  const [interviewQuestions,setInterviewQuestions]=useState([]);
  const [activeQuestionIndex,setActiveQuestionIndex]=useState(0);


    useEffect(() => {
      console.log("Interview ID:", params.interviewId); // Log the interviewId
      console.log("Params: ",params);
      getInterviewDetails();
    }, []);

    const getInterviewDetails=async()=>{
      const details=await db.select().from(MockInterview)
      .where(eq(currentInterviewDetail.mockId,MockInterview.mockId))
      console.log(details);
      setInterviewData(details[0]);
      // setInterviewQuestions(JSON.parse(details[0]?.jsonMockResponse));
      setInterviewQuestions([{"question": "Describe the different types of HTTP methods and when you would use each.","answer": "The most common HTTP methods are GET, POST, PUT, PATCH, and DELETE. GET retrieves data, POST creates new data, PUT updates existing data completely, PATCH updates existing data partially, and DELETE removes data."},{"question": "Explain the difference between Promises and Async/Await in Node.js.","answer": "Promises represent the eventual result of an asynchronous operation, allowing for cleaner handling of asynchronous code than callbacks. Async/Await builds on top of Promises, providing a more synchronous-looking syntax to work with asynchronous code."},{"question": "You are building a user authentication system for a web application. How would you handle user registration, login, and password security in Node.js using a database?","answer": "I would use a combination of bcrypt or Argon2 for password hashing to protect user data, sessions or JWTs for user authentication, and a database like MongoDB or PostgreSQL to store user data securely."},{"question": "Describe a time you had to debug a complex Node.js issue in a production environment. What steps did you take to resolve the problem?","answer": "I once encountered a memory leak issue in a Node.js application. To debug, I used tools like Node.js profiler to identify memory usage patterns and isolate the leak. After identifying the issue, I re-wrote the code using a more efficient memory management strategy and resolved the problem."},{"question": "Design a RESTful API for a simple blog platform. What endpoints would you define, and how would you handle data retrieval and manipulation?","answer": "Endpoints would include '/posts' to list posts, '/posts/{id}' for a single post, '/users' for user management, and '/comments' for comment management. Each endpoint would use appropriate HTTP methods for CRUD operations, and I'd use middleware for authentication, authorization, and validation."},{"question": "Explain how you would ensure your Node.js application performs optimally and scales efficiently.","answer": "Performance optimization strategies include code profiling, caching data frequently accessed, using appropriate data structures and algorithms, and employing load balancing for scalability. Utilizing a database optimized for the workload, minimizing database queries, and proper code structure for maintainability are essential."},{"question": "Tell me about a time you worked in a team to implement a complex feature. What was your role, and how did you contribute to the success of the project?","answer": "On a previous project, I was responsible for building the backend API for a new e-commerce feature. I collaborated closely with the frontend team, participated in code reviews, and communicated effectively to ensure the API met the frontend's needs and aligned with overall project goals."}]);
      // console.log(JSON.parse(details[0]?.jsonMockResponse));
    }
    
  return (
    <div className="min-h-auto flex flex-col items-center mb-4">
      <div className="grid mt-24 grid-cols-1 md:grid-cols-2 gap-10 w-full">
        <div className="self-start">
          <QuestionsSec
            interviewQuestions={interviewQuestions}
            activeQuestionIndex={activeQuestionIndex}
            setActiveQuestionIndex={setActiveQuestionIndex}
            />
        </div>
        <div className="self-start">
          <RecordAnswer
            interviewData={interviewData}
            interviewQuestions={interviewQuestions}
            activeQuestionIndex={activeQuestionIndex}
            setActiveQuestionIndex={setActiveQuestionIndex}
          />
        </div>
      </div>
    </div>

  )
}

export default StartInterview