import Todo from "./components/Todo"
import Form from "./components/Form"
import FilterButton from "./components/FilterButton";
import { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";

export default function App(props) {

  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [editCount, setEditCount] = useState(0)

  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);

  useEffect(() => {
    fetch("http://localhost:8080/todo/all").then(
      (res) => {
        return res.json();
      }).then((todos) => {
        setTasks(todos);
      })
  }, [editCount])

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  useEffect(() => {
    if (tasks.length < prevTaskLength) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, listHeadingRef]);

  const FILTER_MAP = {
    All: () => true,
    Active: (task) => !task.completed,
    Completed: (task) => task.completed,
  };
  const FILTER_NAMES = Object.keys(FILTER_MAP);
  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter} />
  ));

  //One method just takes the parameters after the requested API(Application Programming Interface).
  function addTask(name) {
    fetch("http://localhost:8080/todo/add?name=" + name + "&completed=false", { method: "post"}).then((res) => {
      console.log(res.text());
      setEditCount(editCount+1);
    } )
  }


  // This method directly write the parameters in body. Using JSON.stringify().
  // function addTask(name) {
  //   fetch("http://localhost:8080/todo/add2?name=", { method: "post" , body: JSON.stringify({name: name, compeleted: false})}).then((res) => {
  //     console.log(res.text());
  //     setEditCount(editCount + 1);
  //   })
  // }


  //勾选框
  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        // use object spread to make a new object
        // whose `completed` prop has been inverted
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  //删除
  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
  }

  //对 edit todo tasks
  function editTask(id, newName) {
    const editedTaskList = tasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        // Copy the task and update its name
        return { ...task, name: newName };
      }
      // Return the original task if it's not the edited task
      return task;
    });
    setTasks(editedTaskList);
  }

  const taskList = tasks.filter(FILTER_MAP[filter]).map((task) => (
    <Todo
      name={task.name}
      id={task.id}
      completed={task.completed}
      key={task.id}
      toggleTaskCompleted={toggleTaskCompleted}
      deleteTask={deleteTask}
      editTask={editTask} />
  ));

  const tasksNoun = taskList.length > 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;


  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form onSubmit={addTask} />
      <div className="filters btn-group stack-exception">
        {filterList}
      </div>
      <h2
        id="list-heading"
        tabIndex="-1"
        ref={listHeadingRef}>
        {headingText}
      </h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading">
        {taskList}
      </ul>
    </div>
  );
}



