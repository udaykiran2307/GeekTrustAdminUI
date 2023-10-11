import "./geek.css"
import { AiOutlineDelete } from "react-icons/ai";
import {FiEdit} from "react-icons/fi";
import {AiOutlineCheckSquare}from "react-icons/ai";
import {useState,useEffect} from "react";
import { TfiCheck} from "react-icons/tfi";
import { TfiClose } from "react-icons/tfi";



 const InputBar=({onSearch})=>{
   const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <input
      type = "text"
      placeholder = "search by name,email or role"
      className = "Inputbar"
      value={searchQuery}
      onChange={handleInputChange}
      
       >
    </input>
  )
}


export const Entries = ({ heading = false, row, onDelete, 
                         onEdit, isSelected, onSelect, 
                         onSelectAll,isEditMode,handleSave,                                      handleInputChange,editedData,
                         isTileChecked,setIsTileChecked })=>{

  
if(heading)  return (
  
  <div className="entry">
    <div className="grid-container ">
      <div className="grid-item item1">
        <input 
        className="input-checkbox" 
        type="checkbox"
        checked={isTileChecked}  
        onChange={(e) => {
          onSelectAll()
          setIsTileChecked(!isTileChecked)
        }} 
      />
      </div>
      <div className="grid-item item2">Name</div>
      <div className="grid-item item3">Email</div>
      <div className="grid-item item4">Role</div>
      <div className="grid-item item5">Actions</div>
   </div>
      <hr className ="hr-width"/> 
     </div>
  )

  if (isEditMode) {
    return (
      <div className="entry">
       <div className={`grid-container ${isSelected ? "selected" : ""} `}>
         <div className="grid-item item1">
            <input 
            className="input-checkbox" 
            type="checkbox"
            checked={isSelected}  
            onChange={() => onSelect(row.id)}  
              />
         </div>
        <div className="grid-item ">
          <input
            type="text"
            value={editedData[row.id].name} 
            onChange={(e) => {handleInputChange(e, row.id, 'name')}}
          />
        </div>
        <div className="grid-item ">
          <input
            type="text"
            value={editedData[row.id].email} 
            onChange={(e) => {handleInputChange(e, row.id, 'email')}}
          />
        </div>
        <div className="grid-item ">
          <input
            type="text"
             value={editedData[row.id].role} 
            onChange={(e) => {handleInputChange(e, row.id, 'role')}}
          />
        </div>
        <div className="grid-item ">
          <button className="save-btn" onClick={() => { handleSave(row.id)}}>
            <TfiCheck />
          </button>
          <button className="undo-btn" onClick={() => { handleSave(row.id)}}>
            <TfiClose />
          </button>
           <button className="delete-btn" onClick={(e) => onDelete(row.id)}>
          <AiOutlineDelete />
        </button>  
        </div>
       </div>
        
      </div>
    );
  }
  
  
    return (
   
    <div className="entry">
      <div className={`grid-container ${isSelected ? "selected" : ""} `}>
        <div className= "grid-item item1">
        <input 
        className= "input-checkbox" 
        type="checkbox"
        checked={isSelected}  
        onChange={() => onSelect(row.id)} 
          />
        </div>
        
        <div className="grid-item ">
          {row.name}
        </div>
        <div className="grid-item ">
          {row.email}
        </div>
        <div className="grid-item ">
          {row.role}
        </div>
        <div className="grid-item ">
          <button className="edit-btn" onClick={(e) => onEdit(row.id)}>
            <FiEdit />
          </button>
          <button className="delete-btn" onClick={(e) => onDelete(row.id)}>
            <AiOutlineDelete />
          </button>    
        </div>
     
    </div>
    <hr className ="hr-width"/>  
</div>
  );
};




export default InputBar;
