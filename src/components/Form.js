import React, { useEffect } from "react";
import { useState, useRef } from "react";

export default function Form(props) {

  const [name, setName] = useState("");
  // const inputRef = useRef(null);

  // useEffect(() => {
  //   inputRef.current.focus();
  // });

  function handelChange(event){
    setName(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    props.onSubmit(name);
    setName("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="label-wrapper">
        <label htmlFor="new-todo-input" className="label__lg">
          What needs to be done?
        </label>
      </h2>
      <input
        type="text"
        id="new-todo-input"
        className="input input__lg"
        name="text"
        autoComplete="off"
        value={name}
        // ref={inputRef}
        onChange={handelChange}
      />
      <button type="submit" className="btn btn__primary btn__lg">
        Add
      </button>
    </form>
  );
}