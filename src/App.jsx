import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";


const TodoSchema = Yup.object().shape({
  name: Yup.string().required("Task name is required"),
  description: Yup.string().required("Task description is required"),
});

const App = () => {
  // Load todos from localStorage or initialize with an empty array
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  const [statusFilter, setStatusFilter] = useState("All");

  // Save todos to localStorage whenever the todos array changes
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Function to add a new todo
  const addTodo = (values) => {
    const newTodo = {
      id: Date.now(), // Use a unique id based on the current timestamp
      name: values.name,
      description: values.description,
      status: "Not Completed",
    };
    setTodos([...todos, newTodo]);
  };

  // Function to delete a todo by its id
  const deleteTodo = (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
  };

  // Function to update a todo by its id
  const updateTodo = (id, newTodo) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, ...newTodo } : todo
    );
    setTodos(newTodos);
  };

  // Function to filter todos based on the selected status
  const filterTodos = (todos) => {
    if (statusFilter === "Completed") {
      return todos.filter((todo) => todo.status === "Completed");
    } else if (statusFilter === "Not Completed") {
      return todos.filter((todo) => todo.status === "Not Completed");
    } else {
      return todos;
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>My todo</h2>
      <Formik
        initialValues={{ name: "", description: "" }}
        validationSchema={TodoSchema}
        onSubmit={(values, { resetForm }) => {
          addTodo(values);
          resetForm();
        }}
      >
        {({ errors, touched }) => (
          <Form
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <div>
              <Field name="name" placeholder="Todo Name" />
              {errors.name && touched.name ? (
                <div style={{ color: "red" }}>{errors.name}</div>
              ) : null}
            </div>
            <div>
              <Field name="description" placeholder="Todo Description" />
              {errors.description && touched.description ? (
                <div style={{ color: "red" }}>{errors.description}</div>
              ) : null}
            </div>
            <button
              type="submit"
              style={{
                backgroundColor: "#00c292",
                color: "white",
                border: "none",
                padding: "10px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Add Todo
            </button>
          </Form>
        )}
      </Formik>

      <div>
        <h3 style={{ textAlign: "center" }}>My Todos</h3>
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            marginBottom: "20px",
          }}
        >
          <label style={{ marginRight: "10px" }}>Status Filter: </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              backgroundColor: "#FF6347",
              color: "white",
              padding: "5px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
            }}
          >
            <option value="All">All</option>
            <option value="Completed">Completed</option>
            <option value="Not Completed">Not Completed</option>
          </select>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {filterTodos(todos).map((todo) => (
            <div
              key={todo.id}
              style={{
                padding: "20px",
                backgroundColor: "#C5E3AF",
                borderRadius: "10px",
                width: "300px",
              }}
            >
              <p>
                <strong>Name:</strong> {todo.name}
              </p>
              <p>
                <strong>Description:</strong> {todo.description}
              </p>
              <p>
                <strong>Status:</strong>
                <select
                  value={todo.status}
                  onChange={(e) =>
                    updateTodo(todo.id, { status: e.target.value })
                  }
                  style={{
                    backgroundColor:
                      todo.status === "Completed" ? "#00c292" : "#FF6347",
                    color: "white",
                    padding: "5px",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="Completed">Completed</option>
                  <option value="Not Completed">Not Completed</option>
                </select>
              </p>
              <button
                onClick={() =>
                  updateTodo(todo.id, {
                    name: prompt("Update Task Name", todo.name),
                    description: prompt(
                      "Update Task Description",
                      todo.description
                    ),
                  })
                }
                style={{
                  backgroundColor: "#00c292",
                  color: "white",
                  padding: "10px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              >
                Edit
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                style={{
                  backgroundColor: "#FF6347",
                  color: "white",
                  padding: "10px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
