"use client"
import { supabase } from '@/lib/supabase'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const Todo = () => {
  const [todo, setTodo] = useState({
    name: "",
    email: "",
    password: ""
  })
  const [editId, setEditId] = useState(null);
  const saveTodo = async () => {
    try {
      if (editId) {
        const { data, error } = await supabase.from("student").update({
          name: todo.name,
          email: todo.email,
          password: todo.password
        }).eq("id", editId);
        if (error) {
          console.log(error);
          throw new Error(error.message || "Update operation failed.");
        }
        setEditId(null);
        return data;
      }
      else {
        const { data, error } = await supabase.from("student").insert([todo]).select().single();
        if (error) {
          console.log(error);
          throw new Error(error.message || "Insert operation failed.");
        }
        return data;
      }
    }
    catch (error) {
      console.log(error);
      throw new Error(error.message || "Insert operation failed.");
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.promise(
      saveTodo(),
      {
        loading: 'Data save ho raha hai...',
        success: (newStudent) => {
          setTodo({ name: "", email: "", password: "" });
          fetchTodo();
          return <b>todo is added</b>;
        },
        error: (err) => <b>Error: {err.message}</b>,
      }
    );
  }

  const [data, setData] = useState([]);
  const fetchTodo = async () => {
    const { data, error } = await supabase.from("student").select("*");
    if (error) {
      console.log("error", error);
      toast.error("Error fetching data");
    } else {
      setData(data);
      toast.success("Data fetched successfully");

    }
  }
  useEffect(() => {
    fetchTodo();
  }, [])


  const editHandler = (item) => async () => {
    setTodo({
      name: item.name,
      email: item.email,
      password: item.password
    })
    setEditId(item.id);
  }

  const deleteHandler = (id) => async () => {
    const { data, error } = await supabase.from("student").delete().eq("id", id);
    if (error) {
      console.log("error", error);
      toast.error("Error deleting data");
    } else {
      toast.success("Data deleted successfully");
      fetchTodo();
    }
  }


  return (
    <>
      {/* {JSON.stringify(todo)} */}
      <div className="container-fluid mt-3">
        <div className="container">
          <div className="row">
            <div className="col-md-3 col-12 ">
              <form onSubmit={handleSubmit} className='border p-4 rounded'>
                <h3 className='text-center'>Todo</h3>
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">Name</label>
                  <input
                    onChange={(e) => setTodo({ ...todo, name: e.target.value })}
                    value={todo.name || ""}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                  <input
                    onChange={(e) => setTodo({ ...todo, email: e.target.value })}
                    value={todo.email || ""}
                    type="email"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                  <input
                    type="password"
                    onChange={(e) => setTodo({ ...todo, password: e.target.value })}
                    value={todo.password || ""}
                    className="form-control"
                    id="exampleInputPassword1"
                  />
                </div>
                <button type="submit" className="btn btn-primary">{editId ? "Update" : "Submit"}</button>
                <button type="reset" className="btn btn-warning mx-2" onClick={() => setTodo({})}>reset</button>
              </form>

            </div>
            <div className="col-12 col-md-9 ">
              <div className="table-responsive">
                <div className="border p-2">
                  <h3 className="text-center text-info">Todo List</h3>
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">password</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item, i) => (
                        <tr key={i}>
                          <td scope="row">{item.id}</td>
                          <td>{item.name}</td>
                          <td>{item.email}</td>
                          <td>{item.password}</td>
                          <td>
                            <button className="btn btn-sm btn-info me-2" onClick={editHandler(item)}>Edit</button>
                            <button className="btn btn-sm btn-danger" onClick={deleteHandler(item.id)}>Delete</button>
                          </td>
                        </tr>

                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Todo