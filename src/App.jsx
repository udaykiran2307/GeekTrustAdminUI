// App.jsx

import './App.css'
import InputBar from "./geek.jsx"
import { Entries } from "./geek.jsx"
import { useState, useEffect } from "react"
import { AiOutlineDoubleLeft } from "react-icons/ai";
import { AiOutlineLeft } from "react-icons/ai";
import { AiOutlineDoubleRight } from "react-icons/ai";
import { AiOutlineRight } from "react-icons/ai";

const fetchData = async () => {
  try {
    const data = await fetch("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json");
    const json = await data.json();
    return json;
  }
  catch (e) {
    console.log(e);
  }
}



const Footer = ({ curPage, handlePagenation, lastpage, filteredData, deleteSelected }) => {
  const entriesPerPage = 10;

  const [activeButton, setActiveButton] = useState(1);

  const [numberofButtons, setNumberofButtons] = useState(Math.ceil(filteredData.length / entriesPerPage));

  useEffect(() => {
    setNumberofButtons(Math.ceil(filteredData.length / entriesPerPage));
  }, [filteredData]);

  const buttonNumberArray = Array.from({ length: numberofButtons }, (_, index) => index + 1);

  const handlePageChange = (newPage) => {
    setActiveButton(newPage);
    handlePagenation(newPage);
  }

  return (
    <div className="footer">
      <button
        className="deleteSelected"
        onClick={deleteSelected}
      >
        Delete Selected
      </button>
      <div className="buttons">
        <button
          className={`circle ${activeButton === 1 || curPage === 1 ? 'reach-end' : ''}`}
          onClick={() => { if (activeButton > 1) handlePageChange(1) }}
        >
          <AiOutlineDoubleLeft />
        </button>
        <button
          className={`circle ${activeButton === 1 || curPage === 1 ? 'reach-end' : ''}`}
          onClick={() => { if (activeButton > 1) handlePageChange(activeButton - 1) }}
        >
          <AiOutlineLeft />
        </button>
        {
          buttonNumberArray.map((buttonNum, i) => (
            <button
              className={`circle ${buttonNum === curPage ? 'active' : ''}`}
              onClick={() => handlePageChange(buttonNum)}
              key={buttonNum}
            >
              {buttonNum}
            </button>
          ))
        }
        
        <button
          className={`circle ${(activeButton === numberofButtons || curPage === lastpage) ? 'reach-end' : ''}`}
          onClick={() => { if (activeButton < numberofButtons) handlePageChange(activeButton + 1) }}
        >
          <AiOutlineRight />
        </button>
        
        <button
          className={`circle ${(activeButton === numberofButtons || curPage === lastpage )? 'reach-end' : ''}`}
          onClick={() => { if (activeButton < numberofButtons) handlePageChange(numberofButtons) }}
        >
          <AiOutlineDoubleRight />
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDataId, setSelectedDataId] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [editMode, setEditMode] = useState({});
  const[editedData,setEditedData]=useState([]);
  const[isTileChecked,setIsTileChecked]=useState(false);

  

  useEffect(() => {
    async function fetchDataAndSetData() {
      const json = await fetchData();
      setData(json);
      setFilteredData(json);
    }
    fetchDataAndSetData();
  }, []);


  
  useEffect(() => {
    const filtered = data.filter(
      (entry) =>
        entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [data, searchQuery]);


  
  const entriesPerPage = 10;
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const displayData = filteredData.slice(startIndex, endIndex);
  const lastPage = Math.ceil(filteredData.length / entriesPerPage);

  const handlePageDisplay = (newPage) => {
    setCurrentPage(newPage);
  }

  
  const handleDeleteEntry = (entryId) => {
    const updatedData = data.filter((entry) => entry.id !== entryId);
    setData(updatedData);
    setSelectedDataId(selectedDataId.filter((id) => id !== entryId));

    if ((data.length) % 10 === 1 && entryId === data[data.length - 1].id) {
      handlePageDisplay(currentPage - 1);
    }
  };


  
  const handleSelectAll = () => {
    if (selectedDataId.length === displayData.length) {
      setSelectedDataId([]);
      setSelectAllChecked([]);
    } else {
      const allEntryIds = displayData.map((entry) => entry.id);
      setSelectAllChecked(allEntryIds);
      setSelectedDataId(allEntryIds);
    }
  };


  
  const handleDeleteSelectedEntries = () => {
    const updatedData = data.filter((entry) => !selectedDataId.includes(entry.id));
    setData(updatedData);
    setSelectedDataId([]);
    setSelectAllChecked(false);
    if(isTileChecked){
      setIsTileChecked(false)
      if(currentPage === lastPage && displayData.length==0){
        setCurrentPage(currentPage-1);
      }
    }   
  }


  
  const handleEditEntry = (entryId) => {
        setEditMode({ ...editMode, [entryId]: true });
        setEditedData((prevEditedData) => ({
          ...prevEditedData,
          [entryId]: { ...data.find((entry) => entry.id === entryId) },
        }));
     };


  
  const handleInputChange = (e, entryId, field) => {
    const newValue = e.target.value;
    setEditedData((prevEditedData) => ({
      ...prevEditedData,
      [entryId]: { ...prevEditedData[entryId], [field]: newValue },
    }));
  };


  
  const handleSave = (entryId) => {
      console.log("uday");
      const updatedData = data.map((entry) =>
        entry.id === entryId ? editedData[entryId] : entry
      );
      setData(updatedData);
      setEditMode({ ...editMode, [entryId]: false });
  };


  return (
    <main>
      <InputBar onSearch={setSearchQuery} />

      
      <Entries 
        heading={true}
        onSelectAll={handleSelectAll}
        selectAllchecked 
        isTileChecked={isTileChecked}
        setIsTileChecked={setIsTileChecked}
        />

      
      {displayData.map((entry, i) => (
      <Entries
        key={entry.id}
        row={entry}
        onDelete={() => handleDeleteEntry(entry.id)}
        onEdit={() => handleEditEntry(entry.id)} 
        isSelected={selectedDataId.includes(entry.id)}
        onSelect={(entryId) => {
            setSelectedDataId((prevSelected) => {
              if (prevSelected.includes(entryId)) {
                return prevSelected.filter((id) => id !== entryId);
              } else {
                return [...prevSelected, entryId];
              }
            });
          }}
        
        isEditMode={editMode[entry.id]}
         handleSave={() => handleSave(entry.id)}
        handleInputChange = { handleInputChange}
        editedData = {editedData}
      />
      ))}

      
      <Footer
        curPage={currentPage}
        handlePagenation={handlePageDisplay}
        lastpage={lastPage}
        deleteSelected={handleDeleteSelectedEntries}
        filteredData={filteredData}
      />
      
    </main>
  )
}
