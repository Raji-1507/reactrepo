import React, { useState, useEffect } from 'react';
import './Todo.css';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './dropdown.css'
function Todo () {
  const{userId} = useParams()
  console.log("user:"+userId)
  const [allTodos, setAllTodos] = useState ([]);
  const [allCategories, setAllCategories] = useState ([]);
  const [isupdate,setIsUpdate] = useState('')
  const [isChecked , setIsChecked] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState ('');
  const [newDescription, setNewDescription] = useState ('');
  const [completedTodos, setCompletedTodos] = useState ([]);
  const [isCompletedScreen, setIsCompletedScreen] = useState (false);
  const[isCategoriesScreen,setIsCategoriesScreen] = useState(true);
  const[isOpen,setIsOpen] = useState(false);
  const[newCategory,setNewCategory] = useState('');
  const [error,setError] = useState()
  const[category,setCategory] = useState()
  const[selectedOption,setSelectedOption] = useState(null)
  const handleAddNewToDo = async () => {
    
    try{
    const url = `http://localhost:3001/todo`;
    await axios.post(url,{userId,category:selectedOption,title:newTodoTitle,description:newDescription});
    setIsUpdate("updated1");
    }catch(error){
      console.log(error)
    }
    
  };
  useEffect(() => {
    async function fetchData() {
      let todoUrl = `http://localhost:3001/todo/${userId}`
    let savedTodos = await axios.get(todoUrl);
    let categoryUrl = `http://localhost:3001/category/${userId}`
    let savedCategories = await axios.get(categoryUrl);
    let comtodourl = `http://localhost:3001/${userId}/completed`
    let savedCompletedToDos = await axios.get(comtodourl);
    if(savedCategories){
      setAllCategories(savedCategories.data.list)
    }
    if (savedTodos) {
      setAllTodos (savedTodos.data.list);
    }

    if (savedCompletedToDos) {
      setCompletedTodos (savedCompletedToDos.data.list);
    }
    }
    fetchData();
  }, [isCategoriesScreen,isupdate]);

  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (selectItem) => {
    
    
    setSelectedOption(selectItem); 
    setIsOpen(false);
  };
  const handleToDoDelete = index => {
    let reducedTodos = [...allTodos];
    reducedTodos.splice (index,1);
    // console.log (index);

    // console.log (reducedTodos);
    localStorage.setItem ('todolist', JSON.stringify (reducedTodos));
    setAllTodos (reducedTodos);
  };

  const handleCompletedTodoDelete = index => {
    let reducedCompletedTodos = [...completedTodos];
    reducedCompletedTodos.splice (index);
    // console.log (reducedCompletedTodos);
    localStorage.setItem (
      'completedTodos',
      JSON.stringify (reducedCompletedTodos)
    );
    setCompletedTodos (reducedCompletedTodos);
  };

  const handleComplete = async item => {
    try{
      let url = `http://localhost:3001/${userId}/${item._id}`
      await axios.put(url);
      setIsUpdate("updated3")
    }catch(error){
      console.log(error)
    }
    
  };
  const handleCategoryDelete = index=>{
    let reducedCategories = [...allCategories];
    reducedCategories.splice (index,1);
    // console.log (index);

    // console.log (reducedTodos);
    localStorage.setItem ('categoriesList', JSON.stringify (reducedCategories));
    setAllCategories(reducedCategories);
  }
  const handleAddNewCategory = async (e) => {
    e.preventDefault()
    try{
      const url = `http://localhost:3001/category`;
      await axios.post(url,{userId,newCategory});
      setIsUpdate("updated")
      }catch(error){
        console.log("error")
      }
  };

  return (
    <div className="App">
      <h1>Welcome Home</h1>

      <div className="todo-wrapper">
      <div className="btn-area">
          <button
            className={`secondaryBtn ${isCategoriesScreen === true && 'active'}`}
            onClick={() => {setIsCategoriesScreen (true),useEffect()}}
          >
            Categories
          </button>
          <button
            className={`secondaryBtn ${isCategoriesScreen === false && 'active'}`}
            onClick={() => {setIsCategoriesScreen (false),useEffect()}}
          >
            Todo
          </button>
        </div>
        {isCategoriesScreen === false && 
          <div>
            <div className="todo-input">
              <div className="dropdown todo-input-item todo-input">
        <div className="dropdown-header " onClick={toggleDropdown}>
          <div>{selectedOption ==null? 'Select category':selectedOption.title}</div>
          <div>{isOpen ? '▲' : '▼'}</div>
        </div>
        {isOpen && (
          <div className="dropdown-options-container">
          {allCategories.map((item) => (
            <div
              key={item.title}
              className="dropdown-option"
              onClick={() => handleOptionClick(item)} // Pass 'item' instead of 'option'
            >
              {item.title} {/* Render the specific property of 'item' */}
            </div>
          ))}
        </div>
        )}
              </div>
              <div className="todo-input-item">
                <label>Title:</label>
                <input
                  type="text"
                  value={newTodoTitle}
                  onChange={e => setNewTodoTitle (e.target.value)}
                  placeholder="What's the title of your To Do?"
                />
              </div>
              <div className="todo-input-item">
                <label>Description:</label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={e => setNewDescription (e.target.value)}
                  placeholder="What's the description of your To Do?"
                />
              </div>
              <div className="todo-input-item">
                <button
                  className="primary-btn"
                  type="button"
                  onClick={handleAddNewToDo}
                >
                  Add
                </button>
              </div>
            </div>
            <div className="btn-area">
              <button
                className={`secondaryBtn ${isCompletedScreen === false && 'active'}`}
                onClick={() => setIsCompletedScreen (false)}
              >
                To Do
              </button>
              <button
                className={`secondaryBtn ${isCompletedScreen === true && 'active'}`}
                onClick={() => setIsCompletedScreen (true)}
              >
                Completed
              </button>
            </div>
            <div className="todo-list">

              {isCompletedScreen === false &&
                allTodos.map ((item, index) => (
                  <div className="todo-list-item" key={index}>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>

                    </div>
                    <div>
                      
                      <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={()=>handleComplete(item)}
                          
                        />
                    </div>
                  </div>
                ))}

              {isCompletedScreen === true &&
                completedTodos.map ((item, index) => (
                  <div className="todo-list-item" key={index}>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      <p> <i>Completed at: {item.completedOn}</i></p>
                    </div>
                    <div>
                      <AiOutlineDelete
                        className="icon"
                        onClick={() => handleCompletedTodoDelete (index)}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>}
        {
          isCategoriesScreen === true &&
          <div>
            <div className="todo-input">
              
              <div className="todo-input-item">
                <label>Title:</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  placeholder="What's the title of your category?"
                />
              </div>
              
              <div className="todo-input-item">
                <button
                  className="primary-btn"
                  type="button"
                  onClick={handleAddNewCategory}
                >
                  Create
                </button>
              </div>
            </div>
            {
                allCategories.map ((item, index) => (
                  <div className="todo-list-item" key={index}>
                    <div>
                      <h3>{item.title}</h3>

                    </div>
                    <div>
                      <AiOutlineDelete
                        title="Delete?"
                        className="icon"
                        onClick={() => handleCategoryDelete (index)}
                      />
                      
                    </div>
                  </div>
                ))}

          </div>
        }
        </div>
    </div>
  );
}

export default Todo;