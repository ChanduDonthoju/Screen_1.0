import React, { useState } from 'react';
import axios from 'axios'; 

let schemaOptions = [
  { label: "First Name", value: "first_name" },
  { label: "Last Name", value: "last_name" },
  { label: "Gender", value: "gender" },
  { label: "Age", value: "age" },
  { label: "Account Name", value: "account_name" },
  { label: "City", value: "city" },
  { label: "State", value: "state" }
];

function Segment() {
  let [showPopup, setShowPopup] = useState(false);
  let [segmentName, setSegmentName] = useState("");
  let [selectedSchemas, setSelectedSchemas] = useState([]);
  let [availableSchemas, setAvailableSchemas] = useState(schemaOptions);
  let [selectedSchema, setSelectedSchema] = useState("");

  let handleAddSchema = () => {
    if (selectedSchema) {
      const newSchema = schemaOptions.find(option => option.value === selectedSchema);
      setSelectedSchemas([...selectedSchemas, newSchema]);
      setAvailableSchemas(availableSchemas.filter(option => option.value !== selectedSchema));
      setSelectedSchema("");
    }
  };

  let handleSchemaChange = (index, newValue) => {
    let updatedSchemas = selectedSchemas.map((schema, i) => i === index ? newValue : schema);
    setSelectedSchemas(updatedSchemas);
    let newAvailableSchemas = schemaOptions.filter(option => !updatedSchemas.includes(option));
    setAvailableSchemas(newAvailableSchemas);
  };

  let handleSaveSegment = () => {
    let data = {
      segment_name: segmentName,
      schema: selectedSchemas.map(schema => ({ [schema.value]: schema.label }))
    };
    
    axios.post("https://webhook.site/132eb409-51df-4250-9592-05144c12ba36", data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Success:', response.data);
      setShowPopup(false); 
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  let handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="App">
      <button className='save-segment-main' onClick={() => setShowPopup(true)}>Save segment</button>
      {showPopup && (
        <div className="popup">
          <h2 id='save-seg'>Save Segment</h2><br />
          <label className='font'>
            Enter the name of the segment:
          </label><br />
          <input
          id='segment-name'
            placeholder='Name of the segment'
              type="text"
    letvalue={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
            /><br></br><br></br>
            <p className='font'>To save your segment you need to add the schemas to build the query</p>
          <div className="blue-box">
            {selectedSchemas.map((schema, index) => (
              <div key={index}>
                <select
                id='blue-box-options'
                  value={schema.value}
                  onChange={(e) =>
                    handleSchemaChange(
                      index,
                      schemaOptions.find((option) => option.value === e.target.value)
                    )
                  }
                >
                  {schemaOptions
                    .filter((option) => !selectedSchemas.includes(option) || option.value === schema.value)
                    .map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                </select><br />
              </div>
            ))}
          </div>
          {availableSchemas.length > 0 && (
            <>
              <select
              id='opt-add-schema'
                value={selectedSchema}
                onChange={(e) => setSelectedSchema(e.target.value)}
              >
                <option  value="">Add schema to segment</option>
                {availableSchemas.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select><br /><br />
            </>
          )}
          <button id='add-schema' onClick={handleAddSchema}>+Add new schema</button><br /><br />
          <div id='save-close-div'><button id='final-save-seg' onClick={handleSaveSegment}>Save segment</button>
          <button id='close' onClick={handleClosePopup}>Close</button></div><br /><br />
        </div>
      )}
    </div>
  );
}

export default Segment;
