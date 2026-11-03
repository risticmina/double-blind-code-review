# Double-Blind Code Review Application

A web application for double-blind peer review of programming assignments. Students submit solutions to predefined programming tasks, and each submission is evaluated anonymously by two fellow students and one professor. Reviewers cannot identify the author, and authors cannot identify their reviewers.

Developed as a bachelor's thesis at the **School of Electrical Engineering, University of Belgrade (ETF)**, Department of Computer Engineering and Information Theory.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Author](#author)

## Overview

Code review is an essential practice in software engineering, but evaluations can be influenced by personal bias. This project explores a double-blind approach in which both the author and the reviewers remain anonymous throughout the review process.

The evaluation is performed by human reviewers through a structured assessment form. Automated test results provide additional information to support the reviewers' decisions, rather than replace their judgment.

## Features

### User Roles

- **Student** – submits programming solutions and reviews other students' submissions.
- **Professor** – reviews submissions and defines evaluation criteria for each programming task.

### Code Submission

- Choose one of 10 predefined JavaScript programming tasks.
- Submit a solution for the selected task.
- Run automated tests and view the results before submission.

### Automated Testing

- Each task has 5 predefined test cases.
- Each test case is worth 20 points, giving a maximum score of 100 points.
- Test results provide a baseline evaluation visible to reviewers.

### Reviewer Assignment

- Each submission is assigned to 2 student reviewers and 1 professor.
- Students are never assigned to review their own submissions.
- Student reviewers are selected based on similar grade point averages, starting with a ±1 range and expanding when necessary.
- The system aims to distribute the review workload evenly among students.

### Code Review

- Reviewers evaluate submissions on a scale from 0 to 100.
- Code sections can be highlighted in green (positive feedback) or red (problematic code).
- Reviewers can add or subtract points based on criteria defined by the professor for each task.

### Final Grade

- The final grade is calculated by combining the submitted reviews.
- Student reviews have a weight of 0.9, while the professor's review has a weight of 1.0.

### Anonymous Feedback

- Authors receive three separate views of their submitted code, one for each review.
- Each view contains the reviewer's score and code highlights.
- Reviewer identities remain hidden, including the distinction between student and professor reviews.

## How It Works

1. A student registers and provides their grade point average.
2. The student selects one of the available programming tasks, writes a solution, and runs the automated tests.
3. The student submits the solution, and the system assigns two student reviewers and one professor.
4. Reviewers evaluate the submission without seeing the author's identity. They can inspect the automated test results, highlight code sections, and assign points according to the task-specific criteria.
5. Once all reviews are completed, the system calculates the final grade using the defined review weights.
6. The author receives the anonymous reviews and the final result.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | Angular, TypeScript |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB, Mongoose |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Angular CLI](https://angular.dev/tools/cli)

### Installation

Clone the repository:

```bash
git clone https://github.com/risticmina/double-blind-code-review.git
cd double-blind-code-review
```

Install backend dependencies:

```bash
cd backend_Node
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

### Running the Application

Make sure MongoDB is running locally before starting the backend.

Start the backend and frontend in separate terminals, using the start scripts defined in their respective `package.json` files.

The Angular application is available at:

```text
http://localhost:4200
```

## Project Structure

```text
double-blind-code-review/
├── backend_Node/    # Node.js, Express and MongoDB backend
├── frontend/        # Angular frontend application
└── .gitignore
```

## Author

**Mina Ristić**

School of Electrical Engineering, University of Belgrade

[GitHub Profile](https://github.com/risticmina)