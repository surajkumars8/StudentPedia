import React, { useState } from 'react';
import FloatingNav from '../components/Navbar/Navbar';
import { navItems, notes } from '../constants';
import { 
  Button, 
  Card, 
  CardBody, 
  CardFooter, 
  CardHeader, 
  Heading, 
  Text, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalCloseButton, 
  ModalBody, 
  ModalFooter, 
  Input, 
  useToast // Import the toast hook
} from '@chakra-ui/react';

const NotesPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [noteList, setNoteList] = useState(notes); // Local state for notes
  const [pdfFile, setPdfFile] = useState(null); // State for PDF file
  const [editIndex, setEditIndex] = useState(null); // State for editing note
  const [previewPdf, setPreviewPdf] = useState(null); // State for PDF preview
  const [hoveredIndex, setHoveredIndex] = useState(null); // State for hovered note
  const toast = useToast(); // Initialize the toast

  const handleAddNote = () => {
    if (!pdfFile) {
      toast({
        title: "File Required",
        description: "Please upload a PDF file before adding a note.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newNote = {
      title: newTitle,
      year: '2023', // You can set this dynamically if needed
      regulation: newDescription,
      pdfUrl: URL.createObjectURL(pdfFile), // Create URL for the PDF
    };
    setNoteList([...noteList, newNote]);
    toast({
      title: "File Uploaded",
      description: "Your PDF file has been uploaded successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    resetForm(); // Reset the form after adding note
  };

  const handleEditNote = (index) => {
    const noteToEdit = noteList[index];
    setNewTitle(noteToEdit.title);
    setNewDescription(noteToEdit.regulation);
    setPdfFile(null); // Reset PDF
    setEditIndex(index);
    setIsOpen(true); // Open modal for editing
  };

  const handleUpdateNote = () => {
    if (!pdfFile) {
      toast({
        title: "File Required",
        description: "Please upload a PDF file before updating the note.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const updatedNoteList = [...noteList];
    updatedNoteList[editIndex] = {
      ...updatedNoteList[editIndex],
      title: newTitle,
      regulation: newDescription,
      pdfUrl: URL.createObjectURL(pdfFile), // Update the PDF URL
    };
    setNoteList(updatedNoteList);
    toast({
      title: "File Uploaded",
      description: "Your PDF file has been updated successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    resetForm(); // Reset the form after updating note
  };

  const handleDeleteNote = (index) => {
    // Create a confirmation before deleting the note
    if (window.confirm("Are you sure you want to delete this note?")) {
      const updatedNoteList = noteList.filter((_, i) => i !== index);
      setNoteList(updatedNoteList);
      toast({
        title: "Note Deleted",
        description: "The note has been deleted successfully.",
        status: "info",
        duration: 1500,
        isClosable: true,
      });
    }
  };

  const resetForm = () => {
    setNewTitle('');
    setNewDescription('');
    setPdfFile(null);
    setEditIndex(null);
    setIsOpen(false); // Close modal
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPdfFile(file); // Set the PDF file
  };

  const handleDownload = (pdfUrl) => {
    fetch(pdfUrl) // Fetch the PDF file
      .then((response) => {
        return response.blob(); // Convert it to a Blob
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob); // Create a URL for the Blob
        const link = document.createElement('a'); // Create an anchor element
        link.href = url; // Set the Blob URL as the href
        link.download = pdfUrl.split('/').pop(); // Set the suggested file name
        document.body.appendChild(link); // Append the link to the body
        link.click(); // Programmatically click the link to trigger the download
        link.remove(); // Remove the link from the document
        window.URL.revokeObjectURL(url); // Clean up the Blob URL
      })
      .catch((error) => console.error('Download failed:', error));
  };

  const handlePreview = (pdfUrl) => {
    setPreviewPdf(pdfUrl);
    setIsOpen(true);
  };

  const styles = {
    container: {
      display: 'flex',
      height: '130vh',
      fontFamily: 'Arial, sans-serif',
    },
    mainContent: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      padding: '20px',
      overflowY: 'auto',
    },
    cardContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px',
      justifyContent: 'center',
      marginTop: '50px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    addButton: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: '#007bff',
      color: 'white',
      borderRadius: '50%',
      padding: '15px',
      cursor: 'pointer',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    actionButtons: {
      display: 'flex',
      gap: '5px',
    },
    cardWrapper: {
      position: 'relative',
      '&:hover $actionButtons': {
        display: 'flex',
      },
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <FloatingNav navItems={navItems} />
      <div style={styles.mainContent}>
        <Heading as="h1" size="2xl" color="black" mb={10} fontWeight="bold">Notes</Heading>
        <div style={styles.cardContainer}>
          {noteList.map((note, index) => (
            <div 
              key={index} 
              style={styles.cardWrapper} 
              onMouseEnter={() => setHoveredIndex(index)} 
              onMouseLeave={() => setHoveredIndex(null)} // Clear hovered index
            >
              <Card maxW="sm" p={4} onClick={() => handlePreview(note.pdfUrl)}>
                <CardHeader>
                  <Heading size='md'>{note.title}</Heading>
                </CardHeader>
                <CardBody>
                  <Text>{note.year}</Text>
                  <Text>{note.regulation}</Text>
                </CardBody>
                <CardFooter>
                  <Button onClick={(e) => { e.stopPropagation(); handleDownload(note.pdfUrl); }}>Download</Button>
                </CardFooter>
              </Card>
              {hoveredIndex === index && ( // Show action buttons only if hovered
                <div style={styles.actionButtons}>
                  <Button 
                    size="sm" 
                    onClick={(e) => { e.stopPropagation(); handleEditNote(index); }} 
                    colorScheme="blue"
                  >
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={(e) => { e.stopPropagation(); handleDeleteNote(index); }} 
                    colorScheme="red"
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Note Button */}
        <div style={styles.addButton} onClick={() => setIsOpen(true)}>
          <span style={{ fontSize: '24px', fontWeight: 'bold' }}>+</span>
        </div>

        {/* Modal for Adding/Editing Note */}
        <Modal isOpen={isOpen} onClose={resetForm}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{editIndex !== null ? 'Edit Note' : 'Add a New Note'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input 
                placeholder="Title" 
                value={newTitle} 
                onChange={(e) => setNewTitle(e.target.value)} 
                mb={3}
              />
              <Input 
                placeholder="Description" 
                value={newDescription} 
                onChange={(e) => setNewDescription(e.target.value)} 
                mb={3}
              />
              <Input 
                type="file" 
                accept="application/pdf" 
                onChange={handleFileChange} 
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={editIndex !== null ? handleUpdateNote : handleAddNote}>
                {editIndex !== null ? 'Update Note' : 'Add Note'}
              </Button>
              <Button onClick={resetForm} ml={3}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Preview PDF Modal */}
        <Modal isOpen={!!previewPdf} onClose={() => setPreviewPdf(null)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>PDF Preview</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {previewPdf && (
                <iframe 
                  src={previewPdf}
                  style={{ width: '100%', height: '500px' }} 
                  title="PDF Preview"
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button onClick={() => setPreviewPdf(null)}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default NotesPage;
