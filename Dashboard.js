import React, { useState } from 'react';
import CSVUpload from './CSVUpload';
import ReportTable from './ReportTable';
import { Tabs, Tab, Button, Row, Col, Container, Form, Card } from 'react-bootstrap';
import './styles.css';

const Dashboard = () => {
  const [folderStructure, setFolderStructure] = useState({});
  const [selectedFileData, setSelectedFileData] = useState({});  //Track file data per folder
  const [uploadError, setUploadError] = useState('');
  const [activeTab, setActiveTab] = useState('upload');
  const [newFolderName, setNewFolderName] = useState('');  //For creating new folders
  const [searchQuery, setSearchQuery] = useState('');  //For storing search input

  // Function to create a new folder
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      alert("Folder name cannot be empty");
      return;
    }

    setFolderStructure((prevFolders) => {
      if (prevFolders[newFolderName]) {
        alert("Folder already exists.");
        return prevFolders;
      }

      const updatedFolders = { ...prevFolders, [newFolderName]: [] };  //Create a new folder with an empty file list
      return updatedFolders;
    });
    setNewFolderName('');  //Reset folder name input
  };


  const handleCsvData = (data, fileName) => {
    const folderName = activeTab;

    if (!folderStructure[folderName]) {
      alert("Please create a folder before uploading files.");
      return;
    }

    // Check if the file already exists in the selected folder
    const isFileAlreadyUploaded = folderStructure[folderName]?.some((file) => file.name === fileName);
    if (isFileAlreadyUploaded) {
      setUploadError('This file has already been uploaded.');
      return;
    }

    setUploadError('');
    const fileData = { name: fileName, data };
    setFolderStructure((prevFolders) => {
      const updatedFolders = { ...prevFolders };
      updatedFolders[folderName].push({ ...fileData, status: 'active' });  // Add the file to the folder
      return updatedFolders;
    });
  };

  const handleFileSelect = (folderName, fileData) => {
    // Set the selected file data specific to the folder
    setSelectedFileData((prevData) => ({
      ...prevData,
      [folderName]: fileData,  // Store file data based on folder name
    }));
  };

  const toggleFileStatus = (folderName, fileName) => {
    setFolderStructure((prevFolders) => {
      const updatedFolders = { ...prevFolders };
      updatedFolders[folderName] = updatedFolders[folderName].map((file) =>
        file.name === fileName ? { ...file, status: file.status === 'active' ? 'inactive' : 'active' } : file
      );
      return updatedFolders;
    });
  };

  const deleteFile = (folderName, fileName) => {
    setFolderStructure((prevFolders) => {
      const updatedFolders = { ...prevFolders };
      updatedFolders[folderName] = updatedFolders[folderName].filter((file) => file.name !== fileName);
      return updatedFolders;
    });
  };

  // Filter files based on the search query
  const filteredFiles = (folderName, status) => {
    return folderStructure[folderName]?.filter(
      (file) =>
        file.status === status &&
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);  // Update the searchQuery when user types
  };

  

  return (
    <div>
      {/* Folder Creation Section */}
      <div className="folder-creation-container">
      {/* Folder Creation Section with a more interactive design */}
      <div className="folder-creation-box">
        <h4>Create Folder</h4>
        <Form.Control
          type="text"
          placeholder="Enter folder name"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          className="folder-input"
        />
        <Button 
          variant="primary" 
          onClick={handleCreateFolder}
          className="create-folder-btn"
          disabled={!newFolderName.trim()}
        >
          Create
        </Button>
      </div>
    </div>
      <Tabs activeKey={activeTab} onSelect={setActiveTab} id="folder-tabs">
        {/* Create a Tab for each folder */}
        {Object.keys(folderStructure).map((folderName) => (
          <Tab eventKey={folderName} title={`${folderName}`} key={folderName}>
            <Container fluid>
              <Row>
                <Col md={4} className="file-list-container">
                  {/* Move Upload CSV above the Search Form */}
                  <CSVUpload onDataParsed={handleCsvData} uploadedFiles={folderStructure[folderName]} />
                  {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
                  <Form.Control
                    type="text"
                    placeholder="Search reports"
                    value={searchQuery}
                    onChange={handleSearchChange}  // Use handleSearchChange here
                    className="mb-3"
                  />
                  <h4 className="active-reports-header">Active Reports</h4>
                  {filteredFiles(folderName, 'active').length === 0 ? (
                    <p className="no-files-message">No active files</p>
                  ) : (
                    <div className="file-list">
                      {filteredFiles(folderName, 'active').map((file, index) => (
                        <div key={file.name} className="file-item">
                          <Button
                            variant="secondary"
                            className="file-button"
                            onClick={() => handleFileSelect(folderName, file)}  // Update to select file per folder
                          >
                            {`${index + 1}. ${file.name.replace('.csv', '')}`}
                          </Button>
                          <div className="file-buttons">
                            <Button
                              variant="danger"
                              className="toggle-button"
                              onClick={() => toggleFileStatus(folderName, file.name)}
                              title="Mark as Inactive"
                            >
                              Deactivate
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <h4 className="inactive-reports-header">Inactive Reports</h4>
                  {filteredFiles(folderName, 'inactive').length === 0 ? (
                    <p className="no-files-message">No inactive files</p>
                  ) : (
                    <div className="file-list">
                      {filteredFiles(folderName, 'inactive').map((file, index) => (
                        <div key={file.name} className="file-item">
                          <Button
                            variant="secondary"
                            className="file-button"
                            onClick={() => handleFileSelect(folderName, file)}  // Update to select file per folder
                          >
                            {`${index + 1}. ${file.name.replace('.csv', '')}`}
                          </Button>
                          <div className="file-buttons">
                            <Button
                              variant="success"
                              className="toggle-button"
                              onClick={() => toggleFileStatus(folderName, file.name)}
                              title="Mark as Active"
                            >
                              Activate
                            </Button>
                            <Button
                              variant="danger"
                              className="delete-button"
                              onClick={() => deleteFile(folderName, file.name)}
                              title="Delete File"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Col>

                <Col md={8} className="right-panel">
                  {selectedFileData[folderName] && selectedFileData[folderName].data ? (
                    <ReportTable data={selectedFileData[folderName].data} />  // Display file data specific to the folder
                  ) : (
                    <p>Select a file to view its data.</p>
                  )}
                </Col>
              </Row>
            </Container>
          </Tab>
        ))}
      </Tabs>
    </div>
  );
};

export default Dashboard;
